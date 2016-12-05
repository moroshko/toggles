import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import range from 'lodash.range';
import './Board.css';

export default class Board extends Component {
  constructor({ width, height }) {
    super();

    this.noToggles = {};

    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        this.noToggles[this.cellKey(rowIndex, columnIndex)] = 0;
      }
    }

    this.state = {
      toggles: this.noToggles
    };
  }

  cellKey(rowIndex, columnIndex) {
    return `${rowIndex},${columnIndex}`;
  }

  onClearBoardClick = () => {
    this.setState({
      toggles: this.noToggles
    });
  };

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
      <div>
        <div>
          <button onClick={this.onClearBoardClick}>
            Clear board
          </button>
        </div>
        <svg
          className="Board-svg"
          xmlns="http://www.w3.org/2000/svg"
          width={boardWidth}
          height={boardHeight}
          viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
          {this.renderGrid()}
        </svg>
      </div>
    );
  }
}
