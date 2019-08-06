import React from 'react';
import PropTypes from 'prop-types';


const TextPuck = ({ text, color }) => (
  <svg height="50" width="50">
    <circle r="25" cx="25" cy="25" fill={color} />
    <text
      x="25"
      y="25"
      style={{
        fill: 'white',
        stroke: 'white',
        strokeWidth: 2,
        textAnchor: 'middle',
        alignmentBaseline: 'middle',
        letterSpacing: '0.15em',
        fontSize: '25px',
      }}
    >
      {text}
    </text>
  </svg>
);

TextPuck.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
};

TextPuck.defaultProps = {
  text: '',
  color: '#0088cc',
};

export default TextPuck;
