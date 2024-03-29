import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveState, loadState } from './helpers';

const initialState = loadState('sourcesState', { sources: [
        {id: 1, name: 'files', type: 'file', base: 'http://localhost:5000/file/'},
        {id: 2, name: 'lists', type: 'list', base: 'http://localhost:5000/list/'},
        {id: 3, name: 'books', type: 'book', base: 'http://localhost:5000/file/book/'},
        {id: 4, name: 'podcasts', type: 'book', base: 'http://localhost:5000/list/book/'},
], syncSource: 'http://localhost:5000/', syncKey: 'config', current: 0, showSettings: false, unfinishedOnly: false, refreshing: false });

export const fetchSource = createAsyncThunk('sources/fetchSource', async (payload, { getState }) => {
  const source = getState().sources.sources[getState().sources.current];
  return fetch(source.base)
    .then(res => res.json())
    .then(res => new Promise((resolve, _) => resolve({id: source.id, lists: res})));
});

export const refreshList = createAsyncThunk('sources/refreshList', async (payload, { getState }) => {
  return fetch(payload.base_url)
    .then(res => res.json())
    .then(res => new Promise((resolve, _) => resolve({source_id: payload.source_id, list: res})));
});

export const listSelected = createAsyncThunk('sources/listSelected', async (payload, { getState }) => {
  if (!payload.files) {
    return fetch(payload.base_url + '/file')
      .then(res => res.json())
      .then(res => new Promise((resolve, _) => resolve({source_id: payload.source_id, list_id: payload.id, files: res})));
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
    [fetchSource.pending]: (state, action) => {
      state.refreshing = true;
    },
    [fetchSource.fulfilled]: (state, action) => {
      state.refreshing = false;
      const source = state.sources.find(s => s.id === action.payload.id);
      source.lastUpdated = new Date().toLocaleString();
      source.lists = action.payload.lists;
      source.lists.forEach(list => {
        list.source_id = source.id;
        list.base_url = source.base + list.id;
      });
      saveState('sourcesState', state);
    },
    [listSelected.pending]: (state, action) => {
      const source = state.sources.find(s => s.id === action.meta.arg.source_id);
      source.selectedList = action.meta.arg.id;
    },
    [listSelected.fulfilled]: (state, action) => {
      if (action.payload) {
        const source = state.sources.find(s => s.id === action.payload.source_id);
        const selectedList = source.lists.find(l => l.id === action.payload.list_id);
        selectedList.files = action.payload.files;
        saveState('sourcesState', state);
      }
    },
    [refreshList.fulfilled]: (state, action) => {
      const source = state.sources.find(s => s.id === action.payload.source_id);
      const newList = action.payload.list;
      const originalList = source.lists.find(l => l.id === newList.id);

      Object.assign(originalList, newList);
      saveState('sourcesState', state);
    },
    [loadConfig.fulfilled]: (state, action) => {
      const sources = action.payload.sources;
      state.sources = sources;
      saveState('sourcesState', state);
    }
  }
});

export const { setCurrent, setSources, setSyncSource, setSyncKey, showSettings, hideSettings, toggleFinished } = sourcesSlice.actions;
export default sourcesSlice.reducer;
