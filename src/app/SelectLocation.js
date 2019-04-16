import React from 'react';
import L from 'leaflet';
import 'leaflet-control-geocoder';
import { Query } from 'react-apollo';
import 'app/styles/components/SelectLocation.scss';

function getAddressFromCoords(x, y, callback) {
  const geocoder = L.Control.Geocoder.nominatim();
  geocoder.reverse(L.latLng(35.619466, -82.556432), 1, function(result) {
    callback(result[0]);
  });
}

class SelectLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: undefined,
      selectedCoords: [props.x, props.y],
    }
  }

  componentWillMount() {
    if (this.props.x && this.props.y) {
      getAddressFromCoords(this.props.x, this.props.y, (result) =>
        this.setState({
          selectedAddress: result.properties.display_name,
        })
      )
    }
  }

  render() {
    // TODO: when someone types, change the text input-- after a few seconds, search?
    return (<div className="SelectLocation-container">
      <label className="SelectLocation-label">Address:</label>
      <input
        className="SelectLocation-input"
        type="text"
        defaultValue={this.state.selectedAddress}
        onKeyDown={(e) => { console.log(e.target.value) }}
      />
    </div>)
  }

}

export default SelectLocation;
