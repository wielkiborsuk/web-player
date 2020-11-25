import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('sourcesState')) || { sources: [
        {name: 'files', type: 'file', base: 'http://localhost:5000/file/'},
        {name: 'lists', type: 'list', base: 'http://localhost:5000/list/'},
        {name: 'books', type: 'book', base: 'http://localhost:5000/file/book/'},
        {name: 'podcasts', type: 'book', base: 'http://localhost:5000/list/book/'},
], current: 0 };

const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    setCurrent(state, action) {
      state.current = action.payload;
      localStorage.setItem('sourcesState', JSON.stringify(state));
    },
    setSourceLists(state, action) {
      state.sources.find(source => source.base == action.payload.base).lists = action.payload.lists;
      localStorage.setItem('sourcesState', JSON.stringify(state));
    }
  }
});

export const { setCurrent, setSourceLists } = sourcesSlice.actions;
export default sourcesSlice.reducer;
