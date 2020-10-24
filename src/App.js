import React from 'react';
import './App.css';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Player />
        <MediaSource />
      </div>
      );
  }
}

export default App;
