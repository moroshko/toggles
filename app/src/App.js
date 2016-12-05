import React, { Component } from 'react';
import Board from './Board/Board';

export const cellModes = {
  EMPTY_CELL: 'EMPTY_CELL',
  EMPTY_TOGGLE: 'EMPTY_TOGGLE',
  FULL_TOGGLE: 'FULL_TOGGLE'
};

export default class App extends Component {
  render() {
    return (
      <Board
        width={5}
        height={4}
        cellSize={50}
      />
    );
  }
}
