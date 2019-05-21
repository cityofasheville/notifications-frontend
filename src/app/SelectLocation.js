import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Mutation } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { CREATE_USER_PREFERENCE } from 'app/mutations';
import { GET_USER_PREFERENCES } from 'app/queries';
import { omitTypeName } from 'app/utils';
import 'app/styles/components/SelectLocation.scss';

const geocoder = L.Control.Geocoder.nominatim();

function getAddressString(reverseGeocodeResults) {
  return [
    reverseGeocodeResults[0].properties.address.house_number || '',
    reverseGeocodeResults[0].properties.address.road || '',
    reverseGeocodeResults[0].properties.address.city || '',
    reverseGeocodeResults[0].properties.address.postcode || '',
  ].join(' ').trim();
}

function getAddressFromCoords(lat, lon, callback) {
  geocoder.reverse(L.latLng(lat, lon), 1, function(result) {
    callback(result);
  });
}

function getCoordsFromAddress(addressInputText, callback) {
  geocoder.geocode(addressInputText, function(result) {
    callback(result);
  })
}

class SelectLocation extends React.Component {
  constructor(props) {
    super(props);

    let addressCoords = {
      lat: 35.595385,
      lon: -82.548808,
    }

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
      addressInputText: '',
      // The address after it is confirmed to exist
      selectedAddress: undefined,
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
      If there are coordinates supplied as props, get the address to display
    */
    if (this.state.addressCoords) {
      getAddressFromCoords(
        this.state.addressCoords.lat,
        this.state.addressCoords.lon,
        (result) => {
          this.setState({
            selectedAddress: getAddressString(result),
            addressInputText: getAddressString(result),
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          });
        }
      )
    }
  }

  updateCoordsFromMap(lat, lon, createUserPreference) {
    /*
      If the user clicks the map, set the address coordinates
      TODO: only save address if it's in the city?
    */
    getAddressFromCoords(
      lat,
      lon,
      (result) => {
        this.setState({
          addressCoords: { lat, lon },
          selectedAddress: getAddressString(result),
          addressInputText: getAddressString(result),
          addressPossibilities: null,
          addressOutsideCity: result[0].properties.address.city !== 'Asheville',
        });
        createUserPreference();
      }
    )
  }

  handleAddressTyping(inputText) {
    // Update the state as the user types in the input box
    this.setState({
      addressInputText: inputText,
      addressOutsideCity: false,
    })
  }

  handleAddressSubmit(e, createUserPreference) {
    /*
      If someone clicks the button to confirm the address, check to see if it's a valid address
    */
    e.preventDefault(); // Do not refresh the page
    let searchText = this.state.addressInputText;
    if (searchText.indexOf('Asheville') === -1) {
      // Narrow down by adding Asheville if it's not already part of the search text
      searchText += ' Asheville';
    }
    if (searchText.indexOf('North Carolina') === -1) {
      // Narrow down by adding North Carolina if it's not already part of the search text
      searchText += ' North Carolina';
    }

    getCoordsFromAddress(
      searchText,
      (result) => {
        // If there's only one result
        if (result.length === 1) {
          this.setState({
            addressCoords: { lat: result[0].center.lat, lon: result[0].center.lng },
            selectedAddress: getAddressString(result),
            addressInputText: getAddressString(result),
            addressPossibilities: result,
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          })
          createUserPreference();
        }
        else {
          this.setState({ addressPossibilities: result, addressOutsideCity: false })
        }
      }
    )
  }

  handlePossibilityClick(possibility, createUserPreference) {
    this.setState({
      addressCoords: { lat: possibility.center.lat, lon: possibility.center.lng },
      selectedAddress: getAddressString([possibility]),
      addressInputText: getAddressString([possibility]),
      addressPossibilities: [possibility],
      addressOutsideCity: possibility.properties.address.city !== 'Asheville',
    })
    createUserPreference();
  }

  handleFocus(e) {
    e.target.select();
  }

  render() {
    /*
      TODO:
        * update preferences, SHOW THAT THEY WERE UPDATED
        * make center default to 70 court plaza
        * if they unfocus and there are not valid coordinates, make next section tell them to select a valid address
        * reject map clicks outside of asheville-- different city value?  no city value? - give bounding box?
      TODO with simplicity-- check results and show dropdown?
    */

    let errorMessage = null;
    if (this.state.addressPossibilities && this.state.addressPossibilities.length < 1) {
      errorMessage = 'No results found. Please try another address.';
    } else if (this.state.addressOutsideCity) {
      errorMessage = 'That location is not in Asheville. This application only sends alerts concerning developments within Asheville city limits. Please select a different address.';
    }
    return (
      <Mutation
        mutation={CREATE_USER_PREFERENCE}
        variables={{
          user_preference: {
            location_y: this.state.addressCoords.lat,
            location_x: this.state.addressCoords.lon,
            send_types: omitTypeName(this.props.userPreference.send_types),
            subscriptions: omitTypeName(this.props.userPreference.subscriptions || []),
          },
        }}
        refetchQueries={[
          {
            query: GET_USER_PREFERENCES,
            variables: { email: this.props.userPreference.send_types.find(typeObj => typeObj.type === 'EMAIL').email },
          },
        ]}
      >
        {createUserPreference => (
          <React.Fragment>
            <form onSubmit={e => this.handleAddressSubmit(e, createUserPreference)}>
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
            {this.state.addressPossibilities && this.state.addressPossibilities.length > 1 && (
              <div className="address-message">
                <span>Did you mean one of these?</span>
                {this.state.addressPossibilities.length > 0 && this.state.addressPossibilities.map((possibility) => {
                  return (
                    <button
                      key={possibility.properties.place_id}
                      onClick={() => this.handlePossibilityClick(possibility, createUserPreference)}
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
                  this.updateCoordsFromMap(e.latlng.lat, e.latlng.lng, createUserPreference)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <Marker position={[ this.state.addressCoords.lat, this.state.addressCoords.lon ]}>
                  <Popup>{this.state.selectedAddress}</Popup>
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
