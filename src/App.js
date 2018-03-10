import React, { Component } from 'react';
import logo from './doggo-large-image.svg';
import FontAwesome from 'react-fontawesome';
import './App.css';

import SquirrelNetPreview from './SquirrelNetPreview';

class App extends Component {
  render() {
    return (
      <div className="App flex-centered">
        <div className="App-header flex-centered">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Fetching wow intelligence for good doggos.</h1>
          <h2 className="App-subtitle">Deep Learning. Blockchains. The Internet of Doge.</h2>
          <div className="next-arrow">
            <p style={{ margin: 0 }}>See more</p>
            <FontAwesome name="angle-down" size="2x" />
          </div>
        </div>
        <SquirrelNetPreview />
      </div>
    );
  }
}

export default App;
