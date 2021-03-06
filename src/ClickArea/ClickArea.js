import React, { Component } from 'react';

export default class ClickArea extends Component {
  onClick = event => {
    const { row, column, onClick } = this.props;

    onClick(row, column, {
      shiftPressed: event.shiftKey
    });
  };

  render() {
    const { row, column, cellSize } = this.props;

    return (
      <rect
        x={cellSize * column}
        y={cellSize * row}
        width={cellSize}
        height={cellSize}
        fill="transparent"
        onClick={this.onClick}
      />
    );
  }
}
