import React, { Component } from 'react';

const GRID_COLOR = '#ccc';
const TOGGLE_COLOR = '#08BCD0';

export default class Cell extends Component {
  onClick = () => {
    const { rowIndex, columnIndex, onClick } = this.props;

    onClick(rowIndex, columnIndex);
  };

  render() {
    const { rowIndex, columnIndex, size, toggle } = this.props;
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
          toggle === 1 &&
            <circle
              cx={x}
              cy={y}
              r={size * 0.3}
              stroke={TOGGLE_COLOR}
              strokeWidth="2"
              fill="#fff"
            />
        }
        {
          toggle === 2 &&
            <circle
              cx={x}
              cy={y}
              r={size * 0.3}
              fill={TOGGLE_COLOR}
            />
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
