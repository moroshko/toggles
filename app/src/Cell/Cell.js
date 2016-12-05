import React, { Component } from 'react';
import { cellModes } from '../App';

const GRID_COLOR = '#ccc';
const TOGGLE_COLOR = '#08bcd0';
const TOGGLE_HIGHLIGHT_COLOR = '#ff5722';

export default class Cell extends Component {
  onClick = () => {
    const { rowIndex, columnIndex, onClick } = this.props;

    onClick(rowIndex, columnIndex);
  };

  render() {
    const { rowIndex, columnIndex, size, toggle, highlighted } = this.props;
    const x = size * (columnIndex + 0.5);
    const y = size * (rowIndex + 0.5);

    return (
      <g>
        <line
          x1={x}
          y1={size * rowIndex}
          x2={x}
          y2={size * (rowIndex + 1)}
          stroke={GRID_COLOR}
          strokeWidth="1"
        />
        <line
          x1={size * columnIndex}
          y1={y}
          x2={size * (columnIndex + 1)}
          y2={y}
          stroke={GRID_COLOR}
          strokeWidth="1"
        />
        {
          highlighted ?
            <circle
              cx={x}
              cy={y}
              r={size * 0.4}
              fill={TOGGLE_HIGHLIGHT_COLOR}
            />
            : null
        }
        {
          toggle === cellModes.EMPTY_TOGGLE ?
            <circle
              cx={x}
              cy={y}
              r={size * 0.3}
              stroke={TOGGLE_COLOR}
              strokeWidth="2"
              fill="#fff"
            />
            : null
        }
        {
          toggle === cellModes.FULL_TOGGLE ?
            <circle
              cx={x}
              cy={y}
              r={size * 0.3}
              fill={TOGGLE_COLOR}
            />
            : null
        }
        <rect
          x={size * columnIndex}
          y={size * rowIndex}
          width={size}
          height={size}
          fill="transparent"
          onClick={this.onClick}
        />
      </g>
    );
  }
}
