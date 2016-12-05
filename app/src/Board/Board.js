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
      mode: modes.LINES, // modes.TOGGLES,
      toggles: this.noToggles,
      lineStart: null
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

  onCellClickTogglesMode(rowIndex, columnIndex) {
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
  }

  onCellClickLinesMode(rowIndex, columnIndex) {
    const { toggles, lineStart } = this.state;
    const cellKey = this.cellKey(rowIndex, columnIndex);
    const toggle = toggles[cellKey];

    if (toggle === cellModes.EMPTY_CELL) {
      this.setState({
        lineStart: null
      });
      return;
    }

    if (lineStart === null) {
      this.setState({
        lineStart: {
          rowIndex,
          columnIndex
        }
      });
      return;
    }

    if (lineStart.rowIndex === rowIndex && lineStart.columnIndex === columnIndex) {
      this.setState({
        lineStart: null
      });
      return;
    }

    console.log(`Make line from ${lineStart.rowIndex},${lineStart.columnIndex} to ${rowIndex},${columnIndex}`);

    this.setState({
      lineStart: null
    });
  }

  onCellClick = (rowIndex, columnIndex) => {
    const { mode } = this.state;

    if (mode === modes.TOGGLES) {
      this.onCellClickTogglesMode(rowIndex, columnIndex);
    } else if (mode === modes.LINES) {
      this.onCellClickLinesMode(rowIndex, columnIndex);
    }
  };

  renderRow = rowIndex => {
    const { width, cellSize } = this.props;
    const { toggles, lineStart } = this.state;

    return range(width).map(columnIndex =>
      <Cell
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        size={cellSize}
        toggle={toggles[this.cellKey(rowIndex, columnIndex)]}
        highlighted={lineStart !== null && rowIndex === lineStart.rowIndex && columnIndex === lineStart.columnIndex}
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
