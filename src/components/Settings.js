import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, TextField, Button, Box } from '@material-ui/core';
import { hideSettings, setSources, setSyncSource, setSyncKey, saveConfig, loadConfig } from '../state/sourcesSlice';
import './Settings.css';

export default function Settings() {
  const dispatch = useDispatch();
  const settingsVisible = useSelector(s => s.sources.showSettings) || false;
  const syncSourceState = useSelector(s => s.sources.syncSource) || '';
  const syncKeyState = useSelector(s => s.sources.syncKey) || '';
  const sourcesState = useSelector(s => s.sources.sources);

  const [sourcesLocal, setSourcesLocal] = useState([]);
  const [syncSourceLocal, setSyncSourceLocal] = useState('');
  const [syncKeyLocal, setSyncKeyLocal] = useState('');

  const clear = () => {
    setSourcesLocal(sourcesState);
    setSyncSourceLocal(syncSourceState);
    setSyncKeyLocal(syncKeyState);
  }

  const persist = () => {
    dispatch(setSources(sourcesLocal));
    dispatch(setSyncSource(syncSourceLocal));
    dispatch(setSyncKey(syncKeyLocal));
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
    setSyncSourceLocal(syncSourceState);
  }, [syncSourceState, sourcesState]);


  return (
    <Dialog open={settingsVisible} onClose={() => dispatch(hideSettings())}>
      <DialogTitle>Source settings</DialogTitle>
      <DialogTitle>Synchronisation Source</DialogTitle>

      <TextField classes={{root: 'sync-field'}} label="Synchronisation Source" value={syncSourceLocal} onChange={(e) => setSyncSourceLocal(e.target.value)} />
      <TextField classes={{root: 'sync-field'}} label="Synchronisation Key" value={syncKeyLocal} onChange={(e) => setSyncKeyLocal(e.target.value)} />
      <Box className="button-panel">
        <Button variant="contained" onClick={() => dispatch(saveConfig())}>Save</Button>
        <Button variant="contained" onClick={() => dispatch(loadConfig())}>Load</Button>
      </Box>

      <DialogTitle>Media Sources</DialogTitle>
      {sourcesLocal.map(s => (
      <Box key={s.id} className="source-panel">
        <TextField label="name" value={s.name} onChange={(e) => updateName(s.id, e.target.value)} />
        <TextField label="url" value={s.base} onChange={(e) => updateBase(s.id, e.target.value)} />
        <Button variant="contained" onClick={() => remove(s)}>Remove</Button>
      </Box>
          ))}

      <Box className="button-panel">
        <Button variant="contained" onClick={add}>Add</Button>
        <Button variant="contained" onClick={clear}>Clear</Button>
        <Button variant="contained" onClick={persist}>Save</Button>
      </Box>
    </Dialog>
  );
}
