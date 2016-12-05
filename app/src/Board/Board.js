import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import range from 'lodash.range';
import sample from 'lodash.sample';
import { cellModes } from '../App';
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
        this.noToggles[this.cellKey(rowIndex, columnIndex)] = sample(cellModes); // cellModes.EMPTY_CELL;
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
      const nextToggle = toggle === cellModes.EMPTY_CELL ?
        cellModes.EMPTY_TOGGLE :
        (toggle === cellModes.EMPTY_TOGGLE ?
          cellModes.FULL_TOGGLE :
          cellModes.EMPTY_CELL
        );

      this.setState({
        toggles: {
          ...toggles,
          [cellKey]: nextToggle
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
