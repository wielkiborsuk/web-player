import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveState, loadState } from './helpers';

const initialState = loadState('sourcesState', { sources: [
        {name: 'files', type: 'file', base: 'http://localhost:5000/file/'},
        {name: 'lists', type: 'list', base: 'http://localhost:5000/list/'},
        {name: 'books', type: 'book', base: 'http://localhost:5000/file/book/'},
        {name: 'podcasts', type: 'book', base: 'http://localhost:5000/list/book/'},
], current: 0 });

export const fetchSource = createAsyncThunk('sources/fetchSource', async (payload, { getState }) => {
  const base = getState().sources.sources[getState().sources.current].base;
  return fetch(base)
    .then(res => res.json());
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
    }
  },
  extraReducers: {
    [fetchSource.fulfilled]: (state, action) => {
      state.sources[state.current].lists = action.payload;
      saveState('sourcesState', state);
    }
  }
});

export const { setCurrent, setSourceLists } = sourcesSlice.actions;
export default sourcesSlice.reducer;
