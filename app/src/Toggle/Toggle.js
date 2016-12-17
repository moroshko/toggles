import React, { Component } from 'react';

const TOGGLE_COLOR = '#08bcd0';
const TOGGLE_HIGHLIGHT_COLOR = '#ff5722';

export default class Toggle extends Component {
  render() {
    const { row, column, cellSize, isFull, isHighlighted } = this.props;
    const x = cellSize * (column + 0.5);
    const y = cellSize * (row + 0.5);

    return (
      <g>
        {
          isHighlighted ?
            <circle
              cx={x}
              cy={y}
              r={cellSize * 0.4}
              fill={TOGGLE_HIGHLIGHT_COLOR}
            />
            : null
        }
        {
          isFull ?
            <circle
              cx={x}
              cy={y}
              r={cellSize * 0.3}
              fill={TOGGLE_COLOR}
            /> :
            <circle
              cx={x}
              cy={y}
              r={cellSize * 0.3}
              stroke={TOGGLE_COLOR}
              strokeWidth="2"
              fill="#fff"
            />
        }
      </g>
    );
  }
}
