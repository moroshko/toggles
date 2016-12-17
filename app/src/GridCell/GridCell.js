import React, { Component } from 'react';

const GRID_COLOR = '#ccc';

export default class GridCell extends Component {
  render() {
    const { row, column, cellSize } = this.props;
    const x = cellSize * (column + 0.5);
    const y = cellSize * (row + 0.5);

    return (
      <g>
        <line
          x1={x}
          y1={cellSize * row}
          x2={x}
          y2={cellSize * (row + 1)}
          stroke={GRID_COLOR}
          strokeWidth="1"
        />
        <line
          x1={cellSize * column}
          y1={y}
          x2={cellSize * (column + 1)}
          y2={y}
          stroke={GRID_COLOR}
          strokeWidth="1"
        />
      </g>
    );
  }
}
