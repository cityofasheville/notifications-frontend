import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Mutation } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { CREATE_USER_PREFERENCE, UPDATE_USER_PREFERENCE } from 'app/mutations';
import { GET_USER_PREFERENCES } from 'app/queries';
import { omitTypeName } from 'app/utils';
import 'app/styles/components/SelectLocation.scss';

// https://nominatim.org/release-docs/develop/api/Search/


function getAddressString(addressObj) {
  return [
    addressObj[0].properties.address.house_number || '',
    addressObj[0].properties.address.road || '',
    addressObj[0].properties.address.city || '',
    addressObj[0].properties.address.postcode || '',
  ].join(' ').trim();
}

function getAddressFromCoords(lat, lon, callback) {
  const geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: { bounded: 1, viewbox: '-82.671024,35.421592,-82.459938,35.656121' },
  });
  geocoder.reverse(L.latLng(lat, lon), 1, function(result) {
    callback(result);
  });
}

function getCoordsFromAddress(addressInputObj, callback, string = true) {
  let geocoder;
  if (string) {
    geocoder = L.Control.Geocoder.nominatim({
      geocodingQueryParams: { bounded: 1, viewbox: '-82.671024,35.421592,-82.459938,35.656121' },
    });
    const asString = `${addressInputObj.number} ${addressInputObj.street}`;
    geocoder.geocode(asString, function(result) {
      if (result.length === 0) {
        getCoordsFromAddress(addressInputObj, callback, false)
      } else {
        callback(result);
      }
    })
  } else {
      geocoder = L.Control.Geocoder.nominatim({
        geocodingQueryParams: {
          bounded: 1,
          viewbox: '-82.671024,35.421592,-82.459938,35.656121',
          city: 'Asheville',
          street: addressInputObj.street,
        },
      });
      geocoder.geocode(addressInputObj.number, function(result) {
        callback(result);
      })
  }
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
      // The current text of the input box
      addressInputNumber: '',
      addressInputStreet: '',
      // Whether or not the address is in the city
      addressOutsideCity: false,
      // If the entered address matches 0 or more than one, an array of the results
      addressPossibilities: null,
    }
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
    this.handlePossibilityClick = this.handlePossibilityClick.bind(this);
  }

  componentWillMount() {
    /*
      Get the address text to display
      TODO: handle errors
    */
    getAddressFromCoords(
      this.state.addressCoords.lat,
      this.state.addressCoords.lon,
      (result) => {
        this.setState({
          addressInputNumber: result[0].properties.address.house_number,
          addressInputStreet: result[0].properties.address.road,
          addressOutsideCity: result[0].properties.address.city !== 'Asheville',
        });
      }
    )
  }

  updateCoordsFromMap(lat, lon, setUserPreference) {
    /*
      If the user clicks the map, set the address coordinates
      TODO: only save address if it's in the city?
      TODO: handle errors (see component will mount also)
    */
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

  handleAddressTyping(newState) {
    // Update the state as the user types in the input box
    this.setState(Object.assign(
      { addressOutsideCity: false },
      newState,
    ))
  }

  handleAddressSubmit(e, setUserPreference) {
    /*
      If someone clicks the button to confirm the address, check to see if it's a valid address
      TODO: handle errors
    */
    e.preventDefault(); // Do not refresh the page

    getCoordsFromAddress(
      { number: this.state.addressInputNumber, street: this.state.addressInputStreet },
      (result) => {
        // If there's only one result
        if (result.length === 1) {
          this.setState({
            addressCoords: { lat: result[0].center.lat, lon: result[0].center.lng },
            addressInputNumber: result[0].properties.address.house_number,
            addressInputStreet: result[0].properties.address.road,
            addressPossibilities: result,
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          })
          setUserPreference();
        }
        else {
          this.setState({ addressPossibilities: result, addressOutsideCity: false })
        }
      }
    )
  }

  handlePossibilityClick(possibility, setUserPreference) {
    // If there was more than one possible address, handle the user selection between those
    this.setState({
      addressCoords: { lat: possibility.center.lat, lon: possibility.center.lng },
      // addressInputText: getAddressString([possibility]),
      addressInputNumber: possibility.properties.address.house_number,
      addressInputStreet: possibility.properties.address.road,
      addressPossibilities: [possibility],
      addressOutsideCity: possibility.properties.address.city !== 'Asheville',
    })
    setUserPreference();
  }

  handleFocus(e) {
    // Select the text in the input box so that new typing will erase it
    e.target.select();
  }

  render() {
    /*
      TODO:
        * update preferences, SHOW THAT THEY WERE UPDATED
        * make sure error handling is accessible
        * if they unfocus and there are not valid coordinates, make next section tell them to select a valid address
    */
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
        // refetchQueries={[
        //   {
        //     query: GET_USER_PREFERENCES,
        //     variables: {
        //       email: this.props.userPreference ? this.props.userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email : undefined,
        //     },
        //   },
        // ]}
      >
        {setUserPreference => (
          <React.Fragment>
            <form onSubmit={e => this.handleAddressSubmit(e, setUserPreference)}>
              <div className="form-element label-input-assembly">
                <label className="SelectLocation-label">Number</label>
                <input
                  className="SelectLocation-input"
                  type="text"
                  value={this.state.addressInputNumber}
                  onChange={e => this.handleAddressTyping({ addressInputNumber: e.target.value })}
                  onFocus={this.handleFocus}
                />
                <label className="SelectLocation-label">Street</label>
                <input
                  className="SelectLocation-input"
                  type="text"
                  value={this.state.addressInputStreet}
                  onChange={e => this.handleAddressTyping({ addressInputStreet: e.target.value })}
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
            {this.state.addressPossibilities && this.state.addressPossibilities.length > 1 && (
              <div className="address-message">
                <span>Did you mean one of these?</span>
                {this.state.addressPossibilities.length > 0 && this.state.addressPossibilities.map((possibility) => {
                  return (
                    <button
                      key={possibility.properties.place_id}
                      onClick={() => this.handlePossibilityClick(possibility, setUserPreference)}
                      type="submit"
                    >
                      {getAddressString([possibility])}
                    </button>
                  )
                })}
              </div>
            )}
            <div>
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
                  {/*<Popup>{this.state.selectedAddress}</Popup>*/}
                </Marker>
              </Map>
            </div>
          </React.Fragment>
        )}
      </Mutation>
    );
  }
}

export default SelectLocation;
