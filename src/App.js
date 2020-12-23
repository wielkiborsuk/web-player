import React from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js'
import { AppBar, Tabs, Tab, ThemeProvider, createMuiTheme } from '@material-ui/core';
import { setCurrent } from './state/sourcesSlice';

export default function App() {
  const dispatch = useDispatch();
  const current = useSelector(s => s.sources.current);
  const sources = useSelector(s => s.sources.sources);

  const tabs = sources.map((s) => <Tab key={s.base} label={s.name} />);
  const contents = sources.map((s, i) => <MediaSource key={s.base} index={i} />);

  const muiTheme = createMuiTheme({
    palette: {
      //primary: {
        //main: '#9c27b0'
      //},
      //secondary: {
        //main: '#11cb5f'
      //}
    }
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="App">
        <Player />
        {contents}
        <AppBar position="static">
          <Tabs value={current} onChange={(e, value) => { dispatch(setCurrent(value)) }}>
            {tabs}
          </Tabs>
        </AppBar>
      </div>
    </ThemeProvider>
    );
}
