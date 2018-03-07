import React, { Component } from 'react';
import logo from './doggo-square-logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Fetching wow intelligence for good doggos.</h1>
          <h2 className="App-subtitle">Deep learning. Blockchains. Internet of Doge.</h2>
        </header>
      </div>
    );
  }
}

export default App;
