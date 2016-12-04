import React, { Component } from 'react';

export default class Cell extends Component {
  onClick = () => {
    const { rowIndex, columnIndex, onClick } = this.props;

    onClick(rowIndex, columnIndex);
  };

  render() {
    const { rowIndex, columnIndex, width, height, gridColor } = this.props;
    const x = width * (columnIndex + 0.5);
    const y = height * (rowIndex + 0.5);

    return (
      <g>
        <line
          x1={x}
          y1={height * rowIndex}
          x2={x}
          y2={height * (rowIndex + 1)}
          stroke={gridColor}
          strokeWidth="1"
        />
        <line
          x1={width * columnIndex}
          y1={y}
          x2={width * (columnIndex + 1)}
          y2={y}
          stroke={gridColor}
          strokeWidth="1"
        />
        <rect
          x={width * columnIndex}
          y={height * rowIndex}
          width={width}
          height={height}
          fill="transparent"
          onClick={this.onClick}
        />
      </g>
    );
  }
}
