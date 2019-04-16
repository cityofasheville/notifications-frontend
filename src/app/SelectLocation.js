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

function getCoordsFromAddress(addressText, callback) {
  geocoder.geocode(addressText, function(result) {
    callback(result);
  })
}

class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressText: '',
      selectedAddress: undefined,
      addressCoords: props.x && props.y ? [props.x, props.y] : undefined,
      addressPossibilities: null,
      addressOutsideCity: false,
    }
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
  }

  componentWillMount() {
    if (this.state.addressCoords) {
      getAddressFromCoords(
        this.state.addressCoords[0],
        this.state.addressCoords[1],
        (result) =>
          this.setState({
            selectedAddress: getAddressString(result),
            addressText: getAddressString(result),
            addressOutsideCity: result[0].properties.address.city !== 'Asheville',
          })
      )
    }
  }

  updateCoordsFromMap(x, y) {
    getAddressFromCoords(
      x,
      y,
      (result) => this.setState({
        addressCoords: [ x, y ],
        selectedAddress: getAddressString(result),
        addressText: getAddressString(result),
        addressPossibilities: null,
        addressOutsideCity: result[0].properties.address.city !== 'Asheville',
      }))
  }

  handleAddressTyping(newAddressText) {
    this.setState({
      addressText: newAddressText,
    })
  }

  handleAddressSubmit(e) {
    e.preventDefault();
    let searchText = this.state.addressText;
    if (searchText.indexOf('Asheville') === -1) {
      searchText += ' Asheville';
    }
    if (searchText.indexOf('North Carolina') === -1) {
      searchText += ' North Carolina';
    }
    getCoordsFromAddress(
      searchText,
      (result) => {
        if (result.length === 1) {
          this.setState({
            addressCoords: [result[0].center.lat, result[0].center.lng],
            selectedAddress: result[0].name,
            addressText: result[0].name,
            addressPossibilities: null,
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
      addressText: possibility.name,
      addressPossibilities: null,
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
          value={this.state.addressText}
          onChange={(e) => this.handleAddressTyping(e.target.value)}
        />
        <button type="submit">Confirm Address</button>
      </form>
      {errorMessage &&
        <div className="alert-danger">{errorMessage}</div>
      }
      {this.state.addressPossibilities && this.state.addressPossibilities.length > 0 &&
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
