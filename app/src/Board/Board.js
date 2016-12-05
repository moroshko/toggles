import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import range from 'lodash.range';

export default class Board extends Component {
  constructor({ width, height }) {
    super();

    let toggles = {};

    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        toggles[this.cellKey(rowIndex, columnIndex)] = 0;
      }
    }

    this.state = {
      toggles
    };
  }

  cellKey(rowIndex, columnIndex) {
    return `${rowIndex},${columnIndex}`;
  }

  onCellClick = (rowIndex, columnIndex) => {
    const { toggles } = this.state;
    const cellKey = this.cellKey(rowIndex, columnIndex);
    const toggle = toggles[cellKey];

    this.setState({
      toggles: {
        ...toggles,
        [cellKey]: (toggle + 1) % 3
      }
    });
  };

  renderRow = rowIndex => {
    const { width, cellSize } = this.props;
    const { toggles } = this.state;

    return range(width).map(columnIndex =>
      <Cell
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        size={cellSize}
        toggle={toggles[this.cellKey(rowIndex, columnIndex)]}
        onClick={this.onCellClick}
      />
    );
  };

  renderGrid() {
    const { height } = this.props;

    return range(height).map(this.renderRow);
  }

  render() {
    const { width, height, cellSize } = this.props;
    const boardWidth = width * cellSize;
    const boardHeight = height * cellSize;

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
