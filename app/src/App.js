import React, { Component } from 'react';
import Grid from './Grid/Grid';
import './App.css';

class App extends Component {
  render() {
    return (
      <Grid
        horizontalCells={5}
        verticalCells={4}
        cellWidth={50}
        cellHeight={50}
        color="#ccc"
      />
    );
  }
}

export default App;
