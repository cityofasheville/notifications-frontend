import React from 'react';
import PropTypes from 'prop-types';


const TextPuck = ({ text }) => (
  <svg height="50" width="50">
    <circle r="25" cx="25" cy="25" fill="#0088cc" />
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
};

TextPuck.defaultProps = {
  text: '',
};

export default TextPuck;
