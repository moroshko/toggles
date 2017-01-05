import React, { Component } from 'react';

const LINE_COLOR = '#000';
const LINE_WIDTH = '5';

export default class Line extends Component {
  render() {
    const { startRow, startColumn, endRow, endColumn, cellSize, isStraight } = this.props;
    const startX = cellSize * (startColumn + 0.5);
    const startY = cellSize * (startRow + 0.5);
    const endX = cellSize * (endColumn + 0.5);
    const endY = cellSize * (endRow + 0.5);

    if (isStraight) {
      return (
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={LINE_COLOR}
          strokeWidth={LINE_WIDTH}
        />
      );
    }

    const dx = endX - startX;
    const dy = endY - startY;
    const rx = Math.sqrt(dx * dx + dy * dy) / 2;
    const ry = cellSize;
    const xAxisRotation = Math.atan2(dy, dx) * 180 / Math.PI; // Magic here :)

    return (
      <path
        d={`M${startX} ${startY} a ${rx} ${ry} ${xAxisRotation} 0 0 ${dx} ${dy}`}
        stroke={LINE_COLOR}
        strokeWidth={LINE_WIDTH}
        fill="transparent"
      />
    );
  }
}
