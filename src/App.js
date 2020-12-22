import React from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js'
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { setCurrent } from './state/sourcesSlice';

export default function App() {
  const dispatch = useDispatch();
  const current = useSelector(s => s.sources.current);
  const sources = useSelector(s => s.sources.sources);

  const tabs = sources.map((s) => <Tab key={s.base} label={s.name} />);
  const contents = sources.map((s, i) => <MediaSource key={s.base} index={i} />);

  return (
    <div className="App">
      <Player />
      {contents}
      <AppBar position="static">
        <Tabs value={current} onChange={(e, value) => { dispatch(setCurrent(value)) }}>
          {tabs}
        </Tabs>
      </AppBar>
    </div>
    );
}
