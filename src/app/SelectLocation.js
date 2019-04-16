import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Query } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'app/styles/components/SelectLocation.scss';

const geocoder = L.Control.Geocoder.nominatim();

function getAddressFromCoords(x, y, callback) {
  geocoder.reverse(L.latLng(x, y), 1, function(result) {
    callback([
      result[0].properties.address.house_number || '',
      result[0].properties.address.road || '',
      result[0].properties.address.city || '',
      result[0].properties.address.postcode || '',
    ].join(' ').trim());
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
    }
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this);
  }

  componentWillMount() {
    if (this.state.addressCoords) {
      getAddressFromCoords(this.state.addressCoords[0], this.state.addressCoords[1], (result) =>
        this.setState({
          selectedAddress: result,
          addressText: result,
        })
      )
    }
  }

  updateCoordsFromMap(x, y) {
    // check to see if point is in the city with simplicity
    // if it is not, show error message
    // if it is, setstate with new coords and address
    getAddressFromCoords(
      x,
      y,
      (result) => this.setState({
        addressCoords: [ x, y],
        selectedAddress: result,
        addressText: result,
        addressPossibilities: null,
      }))
  }

  handleAddressTyping(newAddressText) {
    this.setState({
      addressText: newAddressText,
    })
  }

  handleAddressSubmit(e) {
    e.preventDefault();
    getCoordsFromAddress(
      `${this.state.addressText} Asheville North Carolina`,
      (result) => {
        if (result.length === 1) {
          this.setState({
            addressCoords: [result[0].center.lat, result[0].center.lng],
            selectedAddress: result[0].name,
            addressText: result[0].name,
            addressPossibilities: null,
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
        * reject map clicks outside of asheville-- different city value?  no city value?
      TODO with simplicity-- check results and show dropdown?
    */
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
      {this.state.addressPossibilities && this.state.addressPossibilities.length < 1 &&
        <div className="alert-danger">No results found. Please try another Asheville address.</div>
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
