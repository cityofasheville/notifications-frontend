import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
// import { Query } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
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

function getAddressFromCoords(x, y, callback) {
  geocoder.reverse(L.latLng(x, y), 1, function(result) {
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
    this.state = {
      // The coordinates of the selected address
      addressCoords: props.x && props.y ? [props.x, props.y] : undefined,
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
  }

  componentWillMount() {
    /*
      If there are coordinates supplied as props, get the address to display
    */
    if (this.state.addressCoords) {
      getAddressFromCoords(
        this.state.addressCoords[0],
        this.state.addressCoords[1],
        (result) =>
          this.setState({
            selectedAddress: getAddressString(result),
            addressInputText: getAddressString(result),
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          })
      )
    }
  }

  updateCoordsFromMap(x, y) {
    /*
      If the user clicks the map, set the address coordinates
      TODO: only save address if it's in the city?
    */
    getAddressFromCoords(
      x,
      y,
      (result) => this.setState({
        addressCoords: [ x, y ],
        selectedAddress: getAddressString(result),
        addressInputText: getAddressString(result),
        addressPossibilities: null,
        addressOutsideCity: result[0].properties.address.city !== 'Asheville',
      }))
  }

  handleAddressTyping(inputText) {
    // Update the state as the user types in the input box
    this.setState({
      addressInputText: inputText,
    })
  }

  handleAddressSubmit(e) {
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
        if (result.length === 1) {
          this.setState({
            addressCoords: [result[0].center.lat, result[0].center.lng],
            selectedAddress: result[0].name,
            addressInputText: result[0].name,
            addressPossibilities: result,
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          })
        }
        else {
          this.setState({ addressPossibilities: result })
        }
      }
    )
  }

  handlePossibilityClick(possibility) {
    this.setState({
      addressCoords: [possibility.center.lat, possibility.center.lng],
      selectedAddress: possibility.name,
      addressInputText: possibility.name,
      addressPossibilities: [possibility],
      addressOutsideCity: possibility.properties.address.city !== 'Asheville',
    })
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

    return (<React.Fragment>
      <form className="SelectLocation-container" onSubmit={this.handleAddressSubmit}>
        <label className="SelectLocation-label form-element">Address:</label>
        <input
          className="SelectLocation-input form-element"
          type="text"
          value={this.state.addressInputText}
          onChange={(e) => this.handleAddressTyping(e.target.value)}
        />
        <button type="submit">Confirm Address</button>
      </form>
      {errorMessage &&
        <div className="alert-danger error-message">{errorMessage}</div>
      }
      {this.state.addressPossibilities && this.state.addressPossibilities.length > 1 &&
        <div>
          <span>Did you mean one of these?</span>
          {this.state.addressPossibilities.map(possibility => {
            return <button key={possibility.properties.place_id} onClick={() => this.handlePossibilityClick(possibility)}>
              {possibility.name}
            </button>
          })}
        </div>
      }
      <div>
        <Map
          center={this.state.addressCoords}
          zoom={14}
          onClick={e => this.updateCoordsFromMap(e.latlng.lat, e.latlng.lng)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={this.state.addressCoords}>
            <Popup>{this.state.selectedAddress}</Popup>
          </Marker>
        </Map>
      </div>
    </React.Fragment>)
  }

}

export default SelectLocation;
