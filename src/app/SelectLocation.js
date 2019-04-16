import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Query } from 'react-apollo';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'app/styles/components/SelectLocation.scss';

function getAddressFromCoords(x, y, callback) {
  const geocoder = L.Control.Geocoder.nominatim();
  geocoder.reverse(L.latLng(x, y), 1, function(result) {
    callback(result[0]);
  });
}

class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: undefined,
    }
  }

  componentWillMount() {
    if (this.props.x && this.props.y) {
      getAddressFromCoords(this.props.x, this.props.y, (result) =>
        this.setState({
          selectedAddress: [
            result.properties.address.house_number || '',
            result.properties.address.road || '',
            result.properties.address.city || '',
            result.properties.address.postcode || '',
          ].join(' '),
        })
      )
    }
  }

  render() {
    // TODO: search simplicity to confirm address and get x and y to send to backend
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
        <Map center={[this.props.x, this.props.y]} zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <Marker position={[this.props.x, this.props.y]}>
            <Popup>The address</Popup>
          </Marker>
        </Map>
      </div>
    </React.Fragment>)
  }

}

export default SelectLocation;
