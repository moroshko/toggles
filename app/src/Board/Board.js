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

    // this.initialState = {
    //   mode: modes.TOGGLES,
    //   toggles: {},
    //   lines: {},
    //   lineStart: null
    // };

    this.initialState = {
      mode: modes.PLAY,
      toggles: {
        [this.toggleKey(0, 2)]: false,
        [this.toggleKey(1, 1)]: false,
        [this.toggleKey(1, 3)]: false,
        [this.toggleKey(3, 0)]: false,
        [this.toggleKey(3, 2)]: false,
        [this.toggleKey(3, 4)]: false
      },
      lines: {
        [this.lineKey(0, 2, 1, 1)]: true,
        [this.lineKey(0, 2, 1, 3)]: true,
        [this.lineKey(1, 1, 3, 0)]: true,
        [this.lineKey(1, 1, 3, 2)]: true,
        [this.lineKey(1, 3, 3, 2)]: true,
        [this.lineKey(1, 3, 3, 4)]: true,
        [this.lineKey(3, 0, 3, 2)]: true,
        [this.lineKey(3, 2, 3, 4)]: true
      },
      lineStart: null
    };

    this.state = this.initialState;
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

  areAllTogglesFull() {
    const { toggles } = this.state;

    for (const toggleKey in toggles) {
      if (toggles[toggleKey] === false) {
        return false;
      }
    }

    return true;
  }

  onResetClick = () => {
    this.setState(this.initialState);
  };

  onModeChange = event => {
    this.setState({
      mode: event.target.value,
      lineStart: null
    });
  };

  onCellClick_TOGGLES(row, column, { shiftPressed }) {
    const { toggles, lines } = this.state;
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

    // shift + clicked the toggle, remove it and all the lines connected to it
    if (shiftPressed) {
      const newLines = Object.keys(lines).reduce((result, lineKey) => {
        const [start, end] = lineKey.split(' - ');

        if (start !== toggleKey && end !== toggleKey) {
          result[lineKey] = true;
        }

        return result;
      }, {});

      this.setState({
        toggles: omit(toggles, toggleKey),
        lines: newLines
      });
      return;
    }

    // change empty toggle to full, or vice versa
    this.setState({
      toggles: {
        ...toggles,
        [toggleKey]: !toggleValue
      }
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

  onCellClick_PLAY(row, column) {
    const { toggles, lines } = this.state;
    const toggleKey = this.toggleKey(row, column);
    const toggleValue = toggles[toggleKey];

    // the cell is empty (no toggle), do nothing
    if (typeof toggleValue === 'undefined') {
      return;
    }

    let newToggles = { ...toggles };

    newToggles[toggleKey] = !newToggles[toggleKey];

    Object.keys(lines).forEach(lineKey => {
      const [start, end] = lineKey.split(' - ');

      if (start === toggleKey) {
        newToggles[end] = !newToggles[end];
      } else if (end === toggleKey) {
        newToggles[start] = !newToggles[start];
      }
    });

    this.setState({
      toggles: newToggles
    });
  }

  onCellClick = (row, column, options) => {
    const { mode } = this.state;

    if (mode === modes.TOGGLES) {
      this.onCellClick_TOGGLES(row, column, options);
    } else if (mode === modes.LINES) {
      this.onCellClick_LINES(row, column);
    } else if (mode === modes.PLAY) {
      this.onCellClick_PLAY(row, column);
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
            <button onClick={this.onResetClick}>
              Reset
            </button>
          </div>
          <div className="Board-mode-and-instructions-container">
            <div>
              <div className="Board-title">
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
            <div className="Board-instructions-container">
              <div className="Board-title">
                Instructions:
              </div>
              <div className="Board-instructions-content">
                {
                  mode === modes.TOGGLES ?
                    <div>
                      Click to add/toggle toggles.<br /><br />
                      Shift+Click to remove a toggle and all lines connected to it.
                    </div>
                    : null
                }
                {
                  mode === modes.LINES ?
                    <div>
                      To add/remove a line,
                      click on one toggle, then on another one.
                    </div>
                    : null
                }
                {
                  mode === modes.PLAY ?
                    <div>
                      Click on toggles until they all become full.
                      {
                        this.areAllTogglesFull() ?
                          <div className="Board-instructions-well-done">
                            Well Done!
                          </div>
                          : null
                      }
                    </div>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
        <svg
          className="Board-svg"
          xmlns="http://www.w3.org/2000/svg"
          width={boardWidth}
          height={boardHeight}
          viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
          {
            mode === modes.TOGGLES ? this.renderGrid() : null
          }
          {this.renderLines()}
          {this.renderToggles()}
          {this.renderClickAreas()}
        </svg>
      </div>
    );
  }
}
