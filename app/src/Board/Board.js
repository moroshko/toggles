import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import range from 'lodash.range';
import './Board.css';

const modes = {
  TOGGLES: 'TOGGLES',
  LINES: 'LINES'
};

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
      mode: modes.TOGGLES,
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

  onModeChange = event => {
    this.setState({
      mode: event.target.value
    });
  };

  onCellClick = (rowIndex, columnIndex) => {
    const { mode } = this.state;

    if (mode === modes.TOGGLES) {
      const { toggles } = this.state;
      const cellKey = this.cellKey(rowIndex, columnIndex);
      const toggle = toggles[cellKey];

      this.setState({
        toggles: {
          ...toggles,
          [cellKey]: (toggle + 1) % 3
        }
      });
    } else if (mode === modes.LINES) {
      console.log('Lines mode:', rowIndex, columnIndex);
    }
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
    const { mode } = this.state;
    const boardWidth = width * cellSize;
    const boardHeight = height * cellSize;

    return (
      <div>
        <div>
          <div>
            <button onClick={this.onClearBoardClick}>
              Clear board
            </button>
          </div>
          <div className="Board-mode-container">
            Mode:
            <label className="Board-mode-label">
              <input
                type="radio"
                name="board-mode"
                value={modes.TOGGLES}
                checked={mode === modes.TOGGLES}
                onChange={this.onModeChange}
              />
              {' Toggles'}
            </label>
            <label className="Board-mode-label">
              <input
                type="radio"
                name="board-mode"
                value={modes.LINES}
                checked={mode === modes.LINES}
                onChange={this.onModeChange}
              />
              {' Lines'}
            </label>
          </div>
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
