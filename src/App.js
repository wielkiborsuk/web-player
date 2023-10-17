import React, { useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import Player from './components/Player.js';
import MediaSource from './components/MediaSource.js';
import Settings from './components/Settings';
import { setBookmarkAlertOpen } from './state/bookmarkSlice';
import { AppBar, Tabs, Tab, ThemeProvider, Snackbar, createTheme } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { setCurrent } from './state/sourcesSlice';

export default function App() {
  const dispatch = useDispatch();
  const current = useSelector(s => s.sources.current);
  const sources = useSelector(s => s.sources.sources);
  const bookmarkAlertOpen = useSelector(s => s.bookmark.bookmarkAlertOpen);
  const bookmarkAlertMessage = useSelector(s => s.bookmark.bookmarkAlertMessage);

  const tabs = sources.map((s) => <Tab key={s.id} label={s.name} title={s.lastUpdated} />);
  const contents = sources.map((s, i) => <MediaSource key={s.id} index={i} />);

  function callRefresh(sources) {
    sources.forEach(s => {
      if (s.type === 'file') {
        fetch(s.base + 'scan').then(res => res.json());
      }
      if (s.type === 'book' && !s.base.includes('file')) {
        fetch(s.base + 'refresh').then(res => res.json());
      }
    });

  }

  useEffect(() => {
    callRefresh(sources);
    let handle = setInterval(callRefresh, 3600 * 1000, sources);

    return () => {
      clearInterval(handle);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = createTheme({
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
    <ThemeProvider theme={theme}>
      <div className="App">
        <Player />
        {contents}
        <AppBar position="static">
          <Tabs value={current} onChange={(e, value) => { dispatch(setCurrent(value)) }}>
            {tabs}
          </Tabs>
        </AppBar>
        <Settings />
          <Snackbar open={bookmarkAlertOpen} autoHideDuration={5000} onClose={() => dispatch(setBookmarkAlertOpen(false))}>
            <Alert severity="warning">{bookmarkAlertMessage}</Alert>
          </Snackbar>
      </div>
    </ThemeProvider>
    );
}
