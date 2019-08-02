import React from 'react';
import PropTypes from 'prop-types';
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
    // TODO: right now this is using OpenStreetMap's nominatim API.  We should probably use SimpliCity instead for the sake of consistency in how addresses display.
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
    this.handlePossibilitySelect = this.handlePossibilitySelect.bind(this);
  }

  componentDidMount() {
    this.isItMountedYet = true;
    // Shady

    const { userPreference } = this.props;
    const { addressCoords } = this.state;

    if (!(userPreference && userPreference.location_y)) {
      return;
    }
    getAddressFromCoords(addressCoords.lat, addressCoords.lon, (result) => {
      // Get the string from the coords to display in the text input box
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
        // TODO: this is also using the OpenStreetMap API, should use SimpliCity
        const addressString = getNominatimAddressString(result);
        this.setState(
          {
            addressCoords: { lat, lon },
            selectedAddress: addressString,
            addressInputText: addressString,
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          },
          () => {
            setUserPreference();
            const { onPrefSaved } = this.props;
            const { selectedAddress } = this.state;
            onPrefSaved(selectedAddress);
          }
        );
      }
    );
  }

  handleAddressTyping(newVal) {
    // Update the state as the user types in the input box
    this.setState({
      addressOutsideCity: false,
      addressInputText: newVal,
      selectedAddress: null,
    });
  }

  handlePossibilitySelect(possibility, setUserPreference) {
    // Handle dropdown select event... should probably user test
    this.setState(
      {
        addressCoords: { lat: possibility.y, lon: possibility.x },
        selectedAddress: possibility.address,
        addressInputText: possibility.address,
        addressOutsideCity: !possibility.is_in_city,
      },
      () => {
        setUserPreference();
        const { onPrefSaved } = this.props;
        const { selectedAddress } = this.state;
        onPrefSaved(selectedAddress);
      }
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
    const { userPreference } = this.props;
    let { email } = this.props;
    const {
      addressCoords,
      addressInputText,
      addressOutsideCity,
      selectedAddress,
    } = this.state;
    if (userPreference && userPreference.send_types) {
      // Linter error because we can't reassign a variable by destructuring
      email = userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email;
    }
    const mutation = userPreference ? UPDATE_USER_PREFERENCE : CREATE_USER_PREFERENCE;
    const newUserPref = stripTypeNameFromObj(Object.assign(
      userPreference || { send_types: { type: 'EMAIL', email } },
      {
        location_y: addressCoords ? addressCoords.lat : undefined,
        location_x: addressCoords ? addressCoords.lon : undefined,
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
                  value={addressInputText}
                  onChange={e => this.handleAddressTyping(e.target.value, setUserPreference)}
                  onFocus={SelectLocation.handleFocus}
                />
              </label>
            </div>
            {addressOutsideCity && <div style={{ display: 'block', margin: '1rem 0 0' }} className="alert-danger">The selected address is outside the City of Asheville&apos;s permitting jurisdiction.  You could still receive notifications for proposed development in Asheville depending on the options you select below.</div>}
            {!selectedAddress && addressInputText.length > 3 && (
              <Query
                query={ADDRESS_SEARCH_QUERY}
                client={simpliCityClient}
                variables={{ searchString: addressInputText }}
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
                          this.handlePossibilitySelect(
                            possibilities[e.nativeEvent.target.selectedIndex - 1],
                            setUserPreference
                          );
                        }}
                      >
                        <option value={null}>Select the address to confirm</option>
                        {possibilities.map(possibility => (
                          <option
                            // TODO: SOLVE ISSUE OF MULTIPLES OF SAME-- search 600 merrimon
                            key={`possibility-${possibility.address}-${possibility.x}`}
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
                center={addressCoords
                  ? [addressCoords.lat, addressCoords.lon]
                  : [35.595385, -82.548808]
                }
                zoom={12}
                onClick={e =>
                  this.updateCoordsFromMap(e.latlng.lat, e.latlng.lng, setUserPreference)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {addressCoords && (
                  <Marker position={[addressCoords.lat, addressCoords.lon]}>
                    { selectedAddress && <Popup>{selectedAddress}</Popup> }
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

SelectLocation.propTypes = {
  userPreference: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    location_x: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    location_y: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    send_types: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string,
      email: PropTypes.string,
    })),
  }),
  email: PropTypes.string,
  onPrefSaved: PropTypes.func,
};

SelectLocation.defaultProps = {
  userPreference: null,
  email: null,
  onPrefSaved: () => null,
};

export default SelectLocation;
