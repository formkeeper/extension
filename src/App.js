/*global chrome*/

import React from 'react';
import logo from './logo.svg';
import './App.css';

function App ({ isExt }) {
  return (
    <div className="App">
      <header className="App-header">
        {isExt ?
          <img src={chrome.runtime.getURL("static/media/logo.svg")} className="App-logo" alt="logo" />
        :
          <img src={logo} className="App-logo" alt="logo" />
        }

        <h1 className="App-title">Welcome to React</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload!
      </p>
    </div>
  );
}

export default App;
