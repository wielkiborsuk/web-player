import React from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js'
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { setCurrent } from './state/sourcesSlice';

class App extends React.Component {
  render() {
    const tabs = this.props.sources.map((s) => <Tab key={s.base} label={s.name} />);
    const contents = this.props.sources.map((s, i) => <MediaSource key={s.base} visible={this.shouldShow(i)} type={s.type} base={s.base} lists={s.lists} />);
    return (
      <div className="App">
        <Player />
        {contents}
        <AppBar position="static">
          <Tabs value={this.props.current} onChange={(e, value) => { this.props.dispatch(setCurrent(value)) }}>
            {tabs}
          </Tabs>
        </AppBar>
      </div>
      );
  }

  shouldShow(index) {
    return index === this.props.current;
  }
}

export default (props) => {
  const dispatch = useDispatch();
  const current = useSelector(s => s.sources.current);
  const sources = useSelector(s => s.sources.sources);
  return (
    <App dispatch={dispatch} current={current} sources={sources} />
  );
};
