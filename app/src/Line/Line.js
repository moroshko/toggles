import React, { Component } from 'react';

const LINE_COLOR = '#000';

export default class Line extends Component {
	render() {
    const { fromRowIndex, fromColumnIndex, toRowIndex, toColumnIndex, size } = this.props;

    return (
    	<line
        x1={size * (fromColumnIndex + 0.5)}
        y1={size * (fromRowIndex + 0.5)}
        x2={size * (toColumnIndex + 0.5)}
        y2={size * (toRowIndex + 0.5)}
        stroke={LINE_COLOR}
        strokeWidth="5"
      />
    );
  }
}
