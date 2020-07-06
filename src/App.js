/*global chrome*/

import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App ({ location }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={chrome.runtime.getURL("static/media/logo.svg")} className="App-logo" alt="logo" />
  <h1 className="App-title">Welcome to {location}</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload!
      </p>
    </div>
  );
}

export default App;
