import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Mutation, Query } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { CREATE_USER_PREFERENCE, UPDATE_USER_PREFERENCE } from 'app/mutations';
import { ADDRESS_SEARCH_QUERY } from 'app/queries';
import { omitTypeName } from 'app/utils';
import 'app/styles/components/SelectLocation.scss';
import simpliCityClient from 'app/SimpliCityClient';


function getAddressFromCoords(lat, lon, callback) {
  const geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: { bounded: 1, viewbox: '-82.671024,35.421592,-82.459938,35.656121' },
  });
  geocoder.reverse(L.latLng(lat, lon), 1, function(result) {
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
  constructor(props) {
    super(props);

    // Default to city hall, which is roughly the center of town
    let addressCoords = {
      lat: 35.595385,
      lon: -82.548808,
    }

    // If the user already has a location, use that instead
    if (props.userPreference && props.userPreference.location_y) {
      addressCoords = {
        lat: props.userPreference.location_y,
        lon: props.userPreference.location_x,
      }
    }

    this.state = {
      // The coordinates of the selected address
      addressCoords,
      addressInputText: '',
      // Whether or not the address is in the city
      addressOutsideCity: false,
      // If the entered address matches 0 or more than one, an array of the results
      addressPossibilities: null,
      selectedAddress: null,
    }
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
    this.handlePossibilityClick = this.handlePossibilityClick.bind(this);
  }

  componentDidMount() {
    if (!(this.props.userPreference && this.props.userPreference.location_y)) {
      return;
    }
    getAddressFromCoords(this.state.addressCoords.lat, this.state.addressCoords.lon, result =>{
      const resultAddressText = getNominatimAddressString(result);
      this.setState({
        addressInputText: resultAddressText,
        selectedAddress: resultAddressText,
      })
    })
  }

  updateCoordsFromMap(lat, lon, setUserPreference) {
    getAddressFromCoords(
      lat,
      lon,
      (result) => {
        this.setState({
          addressCoords: { lat, lon },
          addressInputNumber: result[0].properties.address.house_number,
          addressInputStreet: result[0].properties.address.road,
          addressPossibilities: null,
          addressOutsideCity: result[0].properties.address.city !== 'Asheville',
        });
        setUserPreference();
      }
    )
  }

  handleAddressTyping(newVal) {
    // Update the state as the user types in the input box
    this.setState({
      addressOutsideCity: false,
      addressInputText: newVal,
      selectedAddress: null,
    })
  }

  handleAddressSubmit(e, setUserPreference) {
    /*
      If someone clicks the button to confirm the address, check to see if it's a valid address
      TODO: handle errors
    */
    e.preventDefault(); // Do not refresh the page
  }

  handlePossibilityClick(possibility, setUserPreference) {
    // If there was more than one possible address, handle the user selection between those
    this.setState({
      addressCoords: { lat: possibility.y, lon: possibility.x },
      addressInputText: possibility.address,
      selectedAddress: possibility.address,
      addressPossibilities: [possibility],
      addressOutsideCity: !possibility.is_in_city,
    })
    setUserPreference();
  }

  handleFocus(e) {
    // Select the text in the input box so that new typing will erase it
    e.target.select();
  }

  render() {
    let errorMessage = null;
    if (this.state.addressPossibilities && this.state.addressPossibilities.length < 1) {
      errorMessage = 'No results found. Please try another address.';
    } else if (this.state.addressOutsideCity) {
      errorMessage = 'That location is not in Asheville. This application only sends alerts concerning developments within Asheville city limits. Please select a different address.';
    }

    const mutation = this.props.user_preference ? UPDATE_USER_PREFERENCE : CREATE_USER_PREFERENCE;
    return (
      <Mutation
        mutation={mutation}
        variables={{
          user_preference: {
            location_y: this.state.addressCoords.lat,
            location_x: this.state.addressCoords.lon,
            send_types: [],
            subscriptions: [],
          },
        }}
      >
        {setUserPreference => (
          <React.Fragment>

            <form onSubmit={e => this.handleAddressSubmit(e, setUserPreference)}>
              <div className="form-element label-input-assembly">
                <label className="SelectLocation-label">Address</label>
                <input
                  className="SelectLocation-input"
                  type="text"
                  value={this.state.addressInputText}
                  onChange={e => this.handleAddressTyping(e.target.value)}
                  onFocus={this.handleFocus}
                />
              </div>
              <div className="form-element submit-button">
                <button type="submit">Confirm Address</button>
              </div>
            </form>

            {errorMessage &&
              <div className="alert-danger address-message">{errorMessage}</div>
            }
            {!this.state.selectedAddress && this.state.addressInputText.length > 3 && <Query
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
                  return possibilities.map(possibility => (
                    <button
                      key={possibility.address}
                      onClick={() => this.handlePossibilityClick(possibility, setUserPreference)}
                      type="submit"
                    >
                      {possibility.address}
                    </button>
                  ))
                }
                return <div>Not found</div>
              }}
            </Query>}
            {/*<div>
              <Map
                center={[ this.state.addressCoords.lat, this.state.addressCoords.lon ]}
                zoom={14}
                onClick={e =>
                  this.updateCoordsFromMap(e.latlng.lat, e.latlng.lng, setUserPreference)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={[ this.state.addressCoords.lat, this.state.addressCoords.lon ]}>
                  <Popup>{this.state.selectedAddress}</Popup>
                </Marker>
              </Map>
            </div>*/}
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export default SelectLocation;
