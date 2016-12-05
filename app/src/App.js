import React, { Component } from 'react';
import Board from './Board/Board';
import './App.css';

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
