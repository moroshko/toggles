import React, { Component } from 'react';
import Cell from '../Cell/Cell';
import Line from '../Line/Line';
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

    this.emptyCells = {};

    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      for (let columnIndex = 0; columnIndex < width; columnIndex++) {
        this.emptyCells[this.cellKey(rowIndex, columnIndex)] = sample(cellModes); // cellModes.EMPTY_CELL;
      }
    }

    this.state = {
      mode: modes.LINES, // modes.TOGGLES,
      cells: this.emptyCells,
      lines: [],
      lineStart: null
    };
  }

  cellKey(rowIndex, columnIndex) {
    return `${rowIndex},${columnIndex}`;
  }

  lineKey(rowIndex1, columnIndex1, rowIndex2, columnIndex2) {
    if (rowIndex1 < rowIndex2) {
      return `${rowIndex1},${columnIndex1} - ${rowIndex2},${columnIndex2}`;
    }

    if (rowIndex1 > rowIndex2) {
      return `${rowIndex2},${columnIndex2} - ${rowIndex1},${columnIndex1}`;
    }

    if (columnIndex1 < columnIndex2) {
      return `${rowIndex1},${columnIndex1} - ${rowIndex2},${columnIndex2}`;
    }

    return `${rowIndex2},${columnIndex2} - ${rowIndex1},${columnIndex1}`;
  }

  onClearBoardClick = () => {
    this.setState({
      cells: this.emptyCells
    });
  };

  onModeChange = event => {
    this.setState({
      mode: event.target.value
    });
  };

  onCellClickTogglesMode(rowIndex, columnIndex) {
    const { cells } = this.state;
    const cellKey = this.cellKey(rowIndex, columnIndex);
    const toggle = cells[cellKey];
    const nextToggle = toggle === cellModes.EMPTY_CELL ?
      cellModes.EMPTY_TOGGLE :
      (toggle === cellModes.EMPTY_TOGGLE ?
        cellModes.FULL_TOGGLE :
        cellModes.EMPTY_CELL
      );

    this.setState({
      cells: {
        ...cells,
        [cellKey]: nextToggle
      }
    });
  }

  onCellClickLinesMode(rowIndex, columnIndex) {
    const { cells, lines, lineStart } = this.state;
    const cellKey = this.cellKey(rowIndex, columnIndex);
    const toggle = cells[cellKey];

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

    const lineKey = this.lineKey(lineStart.rowIndex, lineStart.columnIndex, rowIndex, columnIndex);

    this.setState({
      lines: {
        ...lines,
        [lineKey]: true
      },
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
    const { cells, lineStart } = this.state;

    return range(width).map(columnIndex =>
      <Cell
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        size={cellSize}
        mode={cells[this.cellKey(rowIndex, columnIndex)]}
        highlighted={lineStart !== null && rowIndex === lineStart.rowIndex && columnIndex === lineStart.columnIndex}
        onClick={this.onCellClick}
      />
    );
  };

  renderGridWithToggles() {
    const { height } = this.props;

    return range(height).map(this.renderRow);
  }

  renderLines() {
    const { lines } = this.state;
    const { cellSize } = this.props;

    return Object.keys(lines).map(lineKey => {
      const [fromCell, toCell] = lineKey.split(' - ');
      const fromArr = fromCell.split(',').map(Number);
      const toArr = toCell.split(',').map(Number);

      return (
        <Line
          fromRowIndex={fromArr[0]}
          fromColumnIndex={fromArr[1]}
          toRowIndex={toArr[0]}
          toColumnIndex={toArr[1]}
          size={cellSize}
          key={lineKey}
        />
      );
    });
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
          {this.renderLines()}
          {this.renderGridWithToggles()}
        </svg>
      </div>
    );
  }
}
