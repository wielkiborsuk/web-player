import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveState, loadState } from './helpers';

const initialState = loadState('sourcesState', { sources: [
        {id: 1, name: 'files', type: 'file', base: 'http://localhost:5000/file/'},
        {id: 2, name: 'lists', type: 'list', base: 'http://localhost:5000/list/'},
        {id: 3, name: 'books', type: 'book', base: 'http://localhost:5000/file/book/'},
        {id: 4, name: 'podcasts', type: 'book', base: 'http://localhost:5000/list/book/'},
], bookmarkSource: 'http://localhost:5000/bookmark/', current: 0, showSettings: false });

export const fetchSource = createAsyncThunk('sources/fetchSource', async (payload, { getState }) => {
  const source = getState().sources.sources[getState().sources.current];
  return fetch(source.base)
    .then(res => res.json())
    .then(res => new Promise((resolve, _) => resolve({id: source.id, lists: res})));
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
    setBookmarkSource(state, action) {
      state.bookmarkSource = action.payload;
      saveState('sourcesState', state);
    },
    showSettings(state) {
      state.showSettings = true;
      saveState('sourcesState', state);
    },
    hideSettings(state) {
      state.showSettings = false;
      saveState('sourcesState', state);
    }
  },
  extraReducers: {
    [fetchSource.fulfilled]: (state, action) => {
      const source = state.sources.find(s => s.id === action.payload.id);
      source.lists = action.payload.lists;
      saveState('sourcesState', state);
    }
  }
});

export const { setCurrent, setSourceLists, setSources, setBookmarkSource, showSettings, hideSettings } = sourcesSlice.actions;
export default sourcesSlice.reducer;
