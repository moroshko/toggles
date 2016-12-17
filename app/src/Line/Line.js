import React, { Component } from 'react';

const LINE_COLOR = '#000';

export default class Line extends Component {
	render() {
    const { startRow, startColumn, endRow, endColumn, cellSize } = this.props;

    return (
	    <line
        x1={cellSize * (startColumn + 0.5)}
        y1={cellSize * (startRow + 0.5)}
        x2={cellSize * (endColumn + 0.5)}
        y2={cellSize * (endRow + 0.5)}
        stroke={LINE_COLOR}
        strokeWidth="5"
      />
    );
  }
}
