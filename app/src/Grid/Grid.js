import React, { Component } from 'react';
import range from 'lodash.range';

class Grid extends Component {
  render() {
    const { horizontalCells, verticalCells, cellWidth, cellHeight, color } = this.props;
    const xOffset = cellWidth;
    const yOffset = cellHeight;
    const gridWidth = xOffset + horizontalCells * cellWidth + xOffset;
    const gridHeight = yOffset + verticalCells * cellHeight + yOffset;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridWidth}
        height={gridHeight}
        viewBox={`0 0 ${gridWidth} ${gridHeight}`}>
        {
          range(horizontalCells + 1).map(i =>
            <line
              x1={xOffset + i * cellWidth}
              y1={yOffset}
              x2={xOffset + i * cellWidth}
              y2={gridHeight - yOffset}
              stroke={color}
              strokeWidth="1"
              key={i}
            />
          )
        }
        {
          range(verticalCells + 1).map(i =>
            <line
              x1={xOffset}
              y1={yOffset + i * cellHeight}
              x2={gridWidth - xOffset}
              y2={yOffset + i * cellHeight}
              stroke={color}
              strokeWidth="1"
              key={i}
            />
          )
        }
      </svg>
    );
  }
}

export default Grid;
