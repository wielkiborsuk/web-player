import React from 'react';
import './App.css';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js'
import { AppBar, Tabs, Tab } from '@material-ui/core';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: 0
    };
  }
  render() {
    return (
      <div className="App">
        <Player />
        <MediaSource visible={this.shouldShow(0)} type="file" base="http://localhost:5000" />
        <MediaSource visible={this.shouldShow(1)} type="list" base="http://localhost:5000" />
        <AppBar position="static">
          <Tabs value={this.state.tab} onChange={(e, value) => { this.setState({tab: value}); }}>
            <Tab label="files" />
            <Tab label="lists" />
            <Tab label="podcast" />
          </Tabs>
        </AppBar>
      </div>
      );
  }

  shouldShow(index) {
    return index === this.state.tab;
  }
}

export default App;
