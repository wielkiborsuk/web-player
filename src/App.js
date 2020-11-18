import React from 'react';
import './App.css';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js'
import { AppBar, Tabs, Tab } from '@material-ui/core';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
      sources: [
        {name: 'files', type: 'file', base: 'http://localhost:5000/file/'},
        {name: 'lists', type: 'list', base: 'http://localhost:5000/list/'},
        {name: 'books', type: 'book', base: 'http://localhost:5000/file/book/'},
        {name: 'podcasts', type: 'book', base: 'http://localhost:5000/list/book/'},
      ]
    };
  }
  render() {
    const tabs = this.state.sources.map((s) => <Tab key={s.base} label={s.name} />);
    const contents = this.state.sources.map((s, i) => <MediaSource key={s.base} visible={this.shouldShow(i)} type={s.type} base={s.base} />);
    return (
      <div className="App">
        <Player />
        {contents}
        <AppBar position="static">
          <Tabs value={this.state.tab} onChange={(e, value) => { this.setState({tab: value}); }}>
            {tabs}
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
