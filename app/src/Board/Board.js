import React, { Component } from 'react';
import GridCell from '../GridCell/GridCell';
import Line from '../Line/Line';
import Toggle from '../Toggle/Toggle';
import ClickArea from '../ClickArea/ClickArea';
import omit from 'lodash.omit';
import range from 'lodash.range';
// import sample from 'lodash.sample';
import './Board.css';

const modes = {
  TOGGLES: 'TOGGLES',
  LINES: 'LINES',
  PLAY: 'PLAY'
};

export default class Board extends Component {
  constructor({ width, height }) {
    super();

    this.state = {
      mode: modes.TOGGLES,
      toggles: {},
      lines: {},
      lineStart: null
    };
  }

  toggleKey(row, column) {
    return `${row},${column}`;
  }

  parseToggleKey(toggleKey) {
    const arr = toggleKey.split(',').map(Number);

    return {
      row: arr[0],
      column: arr[1]
    };
  }

  lineKey(row1, column1, row2, column2) {
    if (row1 < row2) {
      return `${row1},${column1} - ${row2},${column2}`;
    }

    if (row1 > row2) {
      return `${row2},${column2} - ${row1},${column1}`;
    }

    if (column1 < column2) {
      return `${row1},${column1} - ${row2},${column2}`;
    }

    return `${row2},${column2} - ${row1},${column1}`;
  }

  parseLineKey(lineKey) {
    const [start, end] = lineKey.split(' - ');
    const startArr = start.split(',').map(Number);
    const endArr = end.split(',').map(Number);

    return {
      startRow: startArr[0],
      startColumn: startArr[1],
      endRow: endArr[0],
      endColumn: endArr[1]
    };
  }

  onClearBoardClick = () => {
    this.setState({
      toggles: {},
      lines: {},
      lineStart: null
    });
  };

  onModeChange = event => {
    this.setState({
      mode: event.target.value
    });
  };

  onCellClick_TOGGLES(row, column) {
    const { toggles } = this.state;
    const toggleKey = this.toggleKey(row, column);
    const toggleValue = toggles[toggleKey];

    // the cell is empty, create an empty toggle
    if (typeof toggleValue === 'undefined') {
      this.setState({
        toggles: {
          ...toggles,
          [toggleKey]: false
        }
      });
      return;
    }

    // the toggle is empty, make it full
    if (toggleValue === false) {
      this.setState({
        toggles: {
          ...toggles,
          [toggleKey]: true
        }
      });
      return;
    }

    // the toggle is full, remove it
    this.setState({
      toggles: omit(toggles, toggleKey)
    });
  }

  onCellClick_LINES(row, column) {
    const { toggles, lines, lineStart } = this.state;
    const toggleKey = this.toggleKey(row, column);
    const toggleValue = toggles[toggleKey];

    // the cell is empty (no toggle), cancel the highlight
    if (typeof toggleValue === 'undefined') {
      this.setState({
        lineStart: null
      });
      return;
    }

    // toggle clicked, highlight it
    if (lineStart === null) {
      this.setState({
        lineStart: {
          row,
          column
        }
      });
      return;
    }

    // highlighted toggle clicked, cancel the highlight
    if (lineStart.row === row && lineStart.column === column) {
      this.setState({
        lineStart: null
      });
      return;
    }

    const lineKey = this.lineKey(lineStart.row, lineStart.column, row, column);

    if (lines[lineKey]) {
      // line already exist, remove it
      this.setState({
        lines: omit(lines, lineKey),
        lineStart: null
      });
    } else {
      // line doesn't exist yet, create it
      this.setState({
        lines: {
          ...lines,
          [lineKey]: true
        },
        lineStart: null
      });
    }
  }

  onCellClick = (row, column) => {
    const { mode } = this.state;

    if (mode === modes.TOGGLES) {
      this.onCellClick_TOGGLES(row, column);
    } else if (mode === modes.LINES) {
      this.onCellClick_LINES(row, column);
    }
  };

  renderGrid() {
    const { height, width, cellSize } = this.props;

    return range(height).map(row =>
      range(width).map(column =>
        <GridCell
          row={row}
          column={column}
          cellSize={cellSize}
        />
      )
    );
  }

  renderLines() {
    const { lines } = this.state;
    const { cellSize } = this.props;

    return Object.keys(lines).map(lineKey => {
      const { startRow, startColumn, endRow, endColumn } = this.parseLineKey(lineKey);

      return (
        <Line
          startRow={startRow}
          startColumn={startColumn}
          endRow={endRow}
          endColumn={endColumn}
          cellSize={cellSize}
          key={lineKey}
        />
      );
    });
  }

  renderToggles() {
    const { cellSize } = this.props;
    const { toggles, lineStart } = this.state;

    return Object.keys(toggles).map(toggleKey => {
      const { row, column } = this.parseToggleKey(toggleKey);

      return (
        <Toggle
          row={row}
          column={column}
          cellSize={cellSize}
          isFull={toggles[toggleKey]}
          isHighlighted={lineStart !== null && row === lineStart.row && column === lineStart.column}
          key={toggleKey}
        />
      );
    });
  }

  renderClickAreas() {
    const { height, width, cellSize } = this.props;

    return range(height).map(row =>
      range(width).map(column =>
        <ClickArea
          row={row}
          column={column}
          cellSize={cellSize}
          onClick={this.onCellClick}
        />
      )
    );
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
            <div className="Board-mode-title">
              Mode:
            </div>
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
            <label className="Board-mode-label">
              <input
                type="radio"
                name="board-mode"
                value={modes.PLAY}
                checked={mode === modes.PLAY}
                onChange={this.onModeChange}
              />
              {' Play'}
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
          {this.renderLines()}
          {this.renderToggles()}
          {this.renderClickAreas()}
        </svg>
      </div>
    );
  }
}
