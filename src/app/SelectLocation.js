import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Query } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'app/styles/components/SelectLocation.scss';

function getAddressFromCoords(x, y, callback) {
  const geocoder = L.Control.Geocoder.nominatim();
  geocoder.reverse(L.latLng(x, y), 1, function(result) {
    console.log(result)
    callback([
      result[0].properties.address.house_number || '',
      result[0].properties.address.road || '',
      result[0].properties.address.city || '',
      result[0].properties.address.postcode || '',
    ].join(' ').trim());
  });
}

class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: undefined,
      addressCoords: props.x && props.y ? [props.x, props.y] : undefined,
    }
  }

  componentWillMount() {
    if (this.state.addressCoords) {
      getAddressFromCoords(this.state.addressCoords[0], this.state.addressCoords[1], (result) =>
        this.setState({
          selectedAddress: result,
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
      }))
  }

  render() {
    /*
      TODO: as they type (debounce this):
        * check simplicity for results and show dropdown
        * if they select one or there is only one result, update preferences, SHOW THAT THEY WERE UPDATED
        * if they unfocus and there are not valid coordinates, make next section tell them to select a valid address
    */
console.log(this.state)
    return (<React.Fragment>
      <div className="SelectLocation-container">
        <label className="SelectLocation-label form-element">Address:</label>
        <input
          className="SelectLocation-input form-element"
          type="text"
          defaultValue={this.state.selectedAddress}
          onKeyDown={(e) => { console.log(e.target.value) }}
        />
      </div>
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
