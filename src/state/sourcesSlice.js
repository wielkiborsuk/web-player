import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveState, loadState } from './helpers';

const initialState = loadState('sourcesState', { sources: [
        {id: 1, name: 'files', type: 'file', base: 'http://localhost:5000/file/'},
        {id: 2, name: 'lists', type: 'list', base: 'http://localhost:5000/list/'},
        {id: 3, name: 'books', type: 'book', base: 'http://localhost:5000/file/book/'},
        {id: 4, name: 'podcasts', type: 'book', base: 'http://localhost:5000/list/book/'},
], syncSource: 'http://localhost:5000/', syncKey: 'config', current: 0, showSettings: false, unfinishedOnly: false });

export const fetchSource = createAsyncThunk('sources/fetchSource', async (payload, { getState }) => {
  const source = getState().sources.sources[getState().sources.current];
  return fetch(source.base)
    .then(res => res.json())
    .then(res => new Promise((resolve, _) => resolve({id: source.id, lists: res})));
});

export const fetchFiles = createAsyncThunk('sources/fetchFiles', async (payload, { getState }) => {
  const source = getState().sources.sources[getState().sources.current];
  const selectedList = getState().playlist.list;
  if (source && selectedList) {
    return fetch(source.base + selectedList.id + '/file')
      .then(res => res.json())
      .then(res => new Promise((resolve, _) => resolve({source_id: source.id, list_id: selectedList.id, files: res})));
  }
});

export const saveConfig = createAsyncThunk('sources/saveConfig', async (payload, { getState }) => {
  const syncSource = getState().sources.syncSource;
  const syncKey = getState().sources.syncKey;
  const sources = getState().sources.sources.map(s => ({...s, lists: null}))
  return fetch(syncSource + 'config/',{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: syncKey, sources: sources, settings: {}, timestamp: Date.now()})
  }).then(res => res.json());
});

export const loadConfig = createAsyncThunk('sources/loadConfig', async (payload, { getState }) => {
  const syncSource = getState().sources.syncSource;
  const syncKey = getState().sources.syncKey;
  if (syncSource) {
    return fetch(syncSource + 'config/' + syncKey)
      .then(res => res.json());
  }
});


const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setCurrent(state, action) {
      state.current = action.payload;
      saveState('sourcesState', state);
    },
    setSourceLists(state, action) {
      state.sources.find(source => source.base === action.payload.base).lists = action.payload.lists;
      saveState('sourcesState', state);
    },
    setSources(state, action) {
      state.sources = action.payload;
      saveState('sourcesState', state);
    },
    setSyncSource(state, action) {
      state.syncSource = action.payload;
      saveState('sourcesState', state);
    },
    setSyncKey(state, action) {
      state.syncKey = action.payload;
      saveState('sourcesState', state);
    },
    showSettings(state) {
      state.showSettings = true;
      saveState('sourcesState', state);
    },
    hideSettings(state) {
      state.showSettings = false;
      saveState('sourcesState', state);
    },
    toggleFinished(state) {
      state.unfinishedOnly = !state.unfinishedOnly;
      saveState('sourcesState', state);
    }
  },
  extraReducers: {
    [fetchSource.fulfilled]: (state, action) => {
      const source = state.sources.find(s => s.id === action.payload.id);
      source.lists = action.payload.lists;
      saveState('sourcesState', state);
    },
    [fetchFiles.fulfilled]: (state, action) => {
      const source = state.sources.find(s => s.id === action.payload.source_id);
      const selectedList = source.lists.find(l => l.id === action.payload.list_id);
      selectedList.files = action.payload.files;
      saveState('sourcesState', state);
    },
    [loadConfig.fulfilled]: (state, action) => {
      const sources = action.payload.sources;
      state.sources = sources;
      saveState('sourcesState', state);
    }
  }
});

export const { setCurrent, setSourceLists, setSources, setSyncSource, setSyncKey, showSettings, hideSettings, toggleFinished } = sourcesSlice.actions;
export default sourcesSlice.reducer;
