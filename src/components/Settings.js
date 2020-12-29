import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, TextField, Button, Box } from '@material-ui/core';
import { hideSettings, setSources, setBookmarkSource } from '../state/sourcesSlice';
import './Settings.css';

export default function Settings() {
  const dispatch = useDispatch();
  const settingsVisible = useSelector(s => s.sources.showSettings) || false;
  const bookmarkSourceState = useSelector(s => s.sources.bookmarkSource) || '';
  const sourcesState = useSelector(s => s.sources.sources);

  const [sourcesLocal, setSourcesLocal] = useState([]);
  const [bookmarkSourceLocal, setBookmarkSourceLocal] = useState('');

  const clear = () => {
    setSourcesLocal(sourcesState);
    setBookmarkSourceLocal(bookmarkSourceState);
  }

  const persist = () => {
    dispatch(setSources(sourcesLocal));
    dispatch(setBookmarkSource(bookmarkSourceLocal));
  }

  const remove = (source) => {
    const newSources = [...sourcesLocal].filter((s) => s.id !== source.id);
    setSourcesLocal(newSources);
  }

  const add = () => {
    setSourcesLocal([...sourcesLocal, {id: Math.random(), name: '', base: ''}]);
  }

  const updateName = (id, value) => {
    const newSources = sourcesLocal.map((s) => {
      return (s.id === id ? {...s, name: value} : s);
    });
    setSourcesLocal(newSources);
  }

  const updateBase = (id, value) => {
    const newSources = sourcesLocal.map((s) => {
      return (s.id === id ? {...s, base: value} : s);
    });
    setSourcesLocal(newSources);
  }

  useEffect(() => {
    setSourcesLocal(sourcesState);
    setBookmarkSourceLocal(bookmarkSourceState);
  }, [bookmarkSourceState, sourcesState]);


  return (
    <Dialog open={settingsVisible} onClose={() => dispatch(hideSettings())}>
      <DialogTitle>Source settings</DialogTitle>
      <DialogTitle>Bookmarks Source</DialogTitle>

      <TextField classes={{root: 'bookmark-field'}} label="Bookmark Source" value={bookmarkSourceLocal} onChange={(e) => setBookmarkSourceLocal(e.target.value)} />
      <DialogTitle>Media Sources</DialogTitle>
      {sourcesLocal.map(s => (
      <Box key={s.id} className="source-panel">
        <TextField label="name" value={s.name} onChange={(e) => updateName(s.id, e.target.value)} />
        <TextField label="url" value={s.base} onChange={(e) => updateBase(s.id, e.target.value)} />
        <Button variant="contained" onClick={() => remove(s)}>Remove</Button>
      </Box>
          ))}

      <Box className="button-panel">
        <Button variant="contained" onClick={add}>Adds</Button>
        <Button variant="contained" onClick={clear}>Reset</Button>
        <Button variant="contained" onClick={persist}>Persist</Button>
      </Box>
    </Dialog>
  );
}
