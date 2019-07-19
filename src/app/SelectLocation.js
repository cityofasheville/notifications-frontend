import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Mutation, Query } from 'react-apollo';
import {
  Map,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';
import { CREATE_USER_PREFERENCE, UPDATE_USER_PREFERENCE } from 'app/mutations';
import { ADDRESS_SEARCH_QUERY } from 'app/queries';
import { stripTypeNameFromObj } from 'app/utils';
import 'app/styles/components/SelectLocation.scss';
import simpliCityClient from 'app/SimpliCityClient';


function getAddressFromCoords(lat, lon, callback) {
  const geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: { bounded: 1, viewbox: '-82.671024,35.421592,-82.459938,35.656121' },
  });
  geocoder.reverse(L.latLng(lat, lon), 1, (result) => {
    callback(result);
  });
}

function getNominatimAddressString(addressObj) {
  return [
    addressObj[0].properties.address.house_number || '',
    addressObj[0].properties.address.road || '',
  ].join(' ').trim();
}


class SelectLocation extends React.Component {
  isItMountedYet = false;

  constructor(props) {
    super(props);
    let addressCoords;
    // If the user already has a location, use that instead
    if (props.userPreference && props.userPreference.location_y) {
      addressCoords = {
        lat: props.userPreference.location_y,
        lon: props.userPreference.location_x,
      };
    }

    this.state = {
      // The coordinates of the selected address
      addressCoords,
      addressInputText: '',
      // Whether or not the address is in the city
      addressOutsideCity: false,
      // If the entered address matches 0 or more than one, an array of the results
      selectedAddress: null,
    };
    this.handlePossibilityClick = this.handlePossibilityClick.bind(this);
  }

  componentDidMount() {
    this.isItMountedYet = true;

    if (!(this.props.userPreference && this.props.userPreference.location_y)) {
      return;
    }
    getAddressFromCoords(this.state.addressCoords.lat, this.state.addressCoords.lon, (result) => {
      const resultAddressText = getNominatimAddressString(result);
      if (this.isItMountedYet) {
        this.setState({
          addressInputText: resultAddressText,
          selectedAddress: resultAddressText,
        });
      }
    });
  }

  updateCoordsFromMap(lat, lon, setUserPreference) {
    getAddressFromCoords(
      lat,
      lon,
      (result) => {
        const addressString = getNominatimAddressString(result);
        this.setState(
          {
            addressCoords: { lat, lon },
            selectedAddress: addressString,
            addressInputText: addressString,
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          },
          () => { setUserPreference(); this.props.onPrefSaved(); }
        );
      }
    );
  }

  handleAddressTyping(newVal, setUserPreference) {
    // Update the state as the user types in the input box
    this.setState({
      addressOutsideCity: false,
      addressInputText: newVal,
      selectedAddress: null,
    });
  }

  handlePossibilityClick(possibility, setUserPreference) {
    // If there was more than one possible address, handle the user selection between those
    this.setState(
      {
        addressCoords: { lat: possibility.y, lon: possibility.x },
        selectedAddress: possibility.address,
        addressInputText: possibility.address,
        addressOutsideCity: !possibility.is_in_city,
      },
      () => { setUserPreference(); this.props.onPrefSaved(); }
    );
  }

  static handleFocus(e) {
    // Select the text in the input box so that new typing will erase it
    e.target.select();
  }

  componentWillUnmount() {
    this.isItMountedYet = false;
  }

  render() {
    // TODO: ERROR ABOUT THINGS OUTSIDE OF CITY LIMITS??
    // 'That location is not in Asheville. This application only sends alerts concerning developments within Asheville city limits. Please select a different address.';
    const mutation = this.props.userPreference ? UPDATE_USER_PREFERENCE : CREATE_USER_PREFERENCE;
    const email = this.props.userPreference && this.props.userPreference.send_types ?
      this.props.userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email :
      this.props.email;
    const newUserPref = stripTypeNameFromObj(Object.assign(
      this.props.userPreference || { send_types: { type: 'EMAIL', email } },
      {
        location_y: this.state.addressCoords ? this.state.addressCoords.lat : undefined,
        location_x: this.state.addressCoords ? this.state.addressCoords.lon : undefined,
      }
    ));
    return (
      <Mutation
        mutation={mutation}
        variables={{ user_preference: newUserPref }}
      >
        {setUserPreference => (
          <React.Fragment>
            <div className="form-element label-input-assembly">
              <label className="SelectLocation-label" htmlFor="address-input">
                <span>
                  Search for an address
                </span>
                <input
                  id="address-input"
                  className="SelectLocation-input"
                  type="text"
                  value={this.state.addressInputText}
                  onChange={e => this.handleAddressTyping(e.target.value, setUserPreference)}
                  onFocus={SelectLocation.handleFocus}
                />
              </label>
            </div>
            {!this.state.selectedAddress && this.state.addressInputText.length > 3 && (
              <Query
                query={ADDRESS_SEARCH_QUERY}
                client={simpliCityClient}
                variables={{ searchString: this.state.addressInputText }}
              >
                { ({ loading, error, data }) => {
                  if (loading) return <div>Loading...</div>;
                  if (error) {
                    console.log(error);
                    return <div className="alert-danger">Sorry, there was an error.</div>;
                  }
                  const possibilities = data.search[0].results;
                  if (possibilities && possibilities.length > 0) {
                    return (
                      <select
                        className="possibilities-container"
                        onChange={(e) => {
                          if (!e.target.value) { return; }
                          this.handlePossibilityClick(
                            possibilities[e.nativeEvent.target.selectedIndex - 1],
                            setUserPreference
                          );
                        }}
                      >
                        <option value={null}>Select the address to confirm:</option>
                        {possibilities.map(possibility => (
                          <option
                            key={possibility.address}
                            value={possibility.address}
                          >
                            {possibility.address}
                          </option>
                        ))}
                      </select>
                    );
                  }
                  const errorMessage = 'No results found. Please try another address.';
                  return (<div className="alert-danger address-message">{errorMessage}</div>);
                }}
              </Query>
            )}
            <div>
              <Map
                center={this.state.addressCoords ?
                  [ this.state.addressCoords.lat, this.state.addressCoords.lon ] :
                  [ 35.595385, -82.548808 ]
                }
                zoom={12}
                onClick={e =>
                  this.updateCoordsFromMap(e.latlng.lat, e.latlng.lng, setUserPreference)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {this.state.addressCoords && (
                  <Marker position={[ this.state.addressCoords.lat, this.state.addressCoords.lon ]}>
                    { this.state.selectedAddress && <Popup>{this.state.selectedAddress}</Popup> }
                  </Marker>
                )}
              </Map>
            </div>
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export default SelectLocation;
