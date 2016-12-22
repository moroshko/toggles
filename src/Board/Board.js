import React, { Component } from 'react';
import GridCell from '../GridCell/GridCell';
import Line from '../Line/Line';
import Toggle from '../Toggle/Toggle';
import ClickArea from '../ClickArea/ClickArea';
import findSolution from '../solver';
import omit from 'lodash.omit';
import range from 'lodash.range';
// import sample from 'lodash.sample';
import './Board.css';

const CELL_SIZE = 50;
const modes = {
  TOGGLES: 'TOGGLES',
  LINES: 'LINES',
  PLAY: 'PLAY'
};

export default class Board extends Component {
  constructor() {
    super();

    // this.initialState = {
    //   mode: modes.TOGGLES,
    //   toggles: {},
    //   lines: {},
    //   lineStart: null
    // };

    this.initialState = {
      width: 7,
      height: 7,
      showSolution: false,
      mode: modes.TOGGLES,
      toggles: {
        [this.toggleKey(1, 2)]: false,
        [this.toggleKey(1, 4)]: false,
        [this.toggleKey(3, 1)]: false,
        [this.toggleKey(3, 3)]: false,
        [this.toggleKey(3, 5)]: false,
        [this.toggleKey(5, 1)]: false,
        [this.toggleKey(5, 3)]: false,
        [this.toggleKey(5, 5)]: false
      },
      lines: {
        [this.lineKey(1, 2, 1, 4)]: true,
        [this.lineKey(1, 2, 3, 1)]: true,
        [this.lineKey(1, 2, 3, 3)]: true,
        [this.lineKey(1, 4, 3, 5)]: true,
        [this.lineKey(3, 1, 3, 3)]: true,
        [this.lineKey(3, 3, 3, 5)]: true,
        [this.lineKey(5, 1, 5, 3)]: true,
        [this.lineKey(5, 3, 5, 5)]: true,
        [this.lineKey(3, 1, 5, 1)]: true,
        [this.lineKey(3, 3, 5, 3)]: true,
        [this.lineKey(3, 5, 5, 5)]: true
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

  onResetClick = () => {
    this.setState(this.initialState);
  };

  onSolutionClick = () => {
    const { showSolution } = this.state;

    this.setState({
      showSolution: !showSolution
    });
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
    const { height, width } = this.state;

    return range(height).map(row =>
      range(width).map(column =>
        <GridCell
          row={row}
          column={column}
          cellSize={CELL_SIZE}
        />
      )
    );
  }

  renderArrows() {
    const { width, height } = this.props;
    const { toggles } = this.state;
    let canRemoveFirstRow = true, canRemoveLastRow = true;
    let canRemoveFirstColumn = true, canRemoveLastColumn = true;

    Object.keys(toggles).forEach(toggleKey => {
      const { row, column } = this.parseToggleKey(toggleKey);

      if (row === 0) {
        canRemoveFirstRow = false;
      } else if (row === height - 1) {
        canRemoveLastRow = false;
      }

      if (column === 0) {
        canRemoveFirstColumn = false;
      } else if (column === width - 1) {
        canRemoveLastColumn = false;
      }
    });

    return [
      canRemoveFirstColumn ?
        <button className="Board-arrow-button" style={{ left: -25, top: 0 }} key="remove-first-column">
          →
        </button>
        : null
      ,
      canRemoveFirstRow ?
        <button className="Board-arrow-button" style={{ left: 0, top: -20 }} key="remove-first-row">
          ↓
        </button>
        : null
      ,
      <button className="Board-arrow-button" style={{ right: 0, top: -20 }} key="add-first-row">
        ↑
      </button>
      ,
      <button className="Board-arrow-button" style={{ right: -25, top: 0 }} key="add-last-column">
        →
      </button>
      ,
      canRemoveLastColumn ?
        <button className="Board-arrow-button" style={{ right: -25, bottom: 0 }} key="remove-last-column">
          ←
        </button>
        : null
      ,
      canRemoveLastRow ?
        <button className="Board-arrow-button" style={{ right: 0, bottom: -20 }} key="remove-last-row">
          ↑
        </button>
        : null
      ,
      <button className="Board-arrow-button" style={{ left: 0, bottom: -20 }} key="add-last-row">
        ↓
      </button>
      ,
      <button className="Board-arrow-button" style={{ left: -25, bottom: 0 }} key="add-first-column">
        ←
      </button>
    ];
  }

  renderLines() {
    const { lines } = this.state;

    return Object.keys(lines).map(lineKey => {
      const { startRow, startColumn, endRow, endColumn } = this.parseLineKey(lineKey);

      return (
        <Line
          startRow={startRow}
          startColumn={startColumn}
          endRow={endRow}
          endColumn={endColumn}
          cellSize={CELL_SIZE}
          key={lineKey}
        />
      );
    });
  }

  renderToggles(solution) {
    const { showSolution, toggles, lineStart } = this.state;
    const solutionExists = showSolution && solution !== null;

    return Object.keys(toggles).map(toggleKey => {
      const { row, column } = this.parseToggleKey(toggleKey);

      return (
        <Toggle
          row={row}
          column={column}
          cellSize={CELL_SIZE}
          isFull={toggles[toggleKey]}
          isHighlighted={lineStart !== null && row === lineStart.row && column === lineStart.column}
          isInSolution={solutionExists && solution.indexOf(toggleKey) > -1}
          key={toggleKey}
        />
      );
    });
  }

  renderClickAreas() {
    const { height, width } = this.state;

    return range(height).map(row =>
      range(width).map(column =>
        <ClickArea
          row={row}
          column={column}
          cellSize={CELL_SIZE}
          onClick={this.onCellClick}
        />
      )
    );
  }

  render() {
    const { width, height, showSolution, mode, toggles, lines } = this.state;
    const solution = mode === modes.PLAY ? findSolution(toggles, lines) : null;
    const boardWidth = width * CELL_SIZE;
    const boardHeight = height * CELL_SIZE;

    return (
      <div>
        <div>
          <div>
            <button onClick={this.onResetClick}>
              Reset board
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
                        solution !== null && solution.length === 0 ?
                          <div className="Board-instructions-well-done">
                            Well Done!
                          </div> :
                          <div className="Board-solution-container">
                            <button onClick={this.onSolutionClick}>
                              {showSolution ? 'Hide solution' : 'Show solution'}
                            </button>
                            {
                              showSolution && solution === null ?
                                <span className="Board-unsolvable">Unsolvable!</span>
                                : null
                            }
                          </div>
                      }
                    </div>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
        <div className="Board-svg-container" style={{ width: boardWidth, height: boardHeight }}>
          {
            mode === modes.TOGGLES ? this.renderArrows() : null
          }
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={boardWidth}
            height={boardHeight}
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}>
            {
              mode === modes.TOGGLES ? this.renderGrid() : null
            }
            {this.renderLines()}
            {this.renderToggles(solution)}
            {this.renderClickAreas()}
          </svg>
        </div>
      </div>
    );
  }
}
