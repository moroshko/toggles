import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import range from 'lodash.range';

export default class Board extends Component {
  renderRow = rowIndex => {
    const { width, cellWidth, cellHeight, gridColor } = this.props;

    return range(width).map(columnIndex =>
      <Cell
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        width={cellWidth}
        height={cellHeight}
        gridColor={gridColor}
      />
    );
  };

  renderGrid() {
    const { height } = this.props;

    return range(height).map(this.renderRow);
  }

  render() {
    const { width, height, cellWidth, cellHeight } = this.props;
    const boardWidth = width * cellWidth;
    const boardHeight = height * cellHeight;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={boardWidth}
        height={boardHeight}
        viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
        {this.renderGrid()}
      </svg>
    );
  }
}
