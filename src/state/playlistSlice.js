import { createSlice } from '@reduxjs/toolkit';
import { saveState, loadState } from './helpers';

const initialState = loadState('playlistState', { list: {}, song: {} });

if (initialState.song.name) {
  document.title = initialState.song.name;
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setCurrentList(state, action) {
      state.list = action.payload;
      saveState('playlistState', state);
    },
    setCurrentSong(state, action) {
      state.song = action.payload;
      saveState('playlistState', state);
      document.title = state.song.name;
    },
    next(state) {
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      state.song = state.list.files[(index+1) % state.list.files.length];
      saveState('playlistState', state);
      document.title = state.song.name;
    },
    previous(state) {
      const listLength = state.list.files.length;
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      state.song = state.list.files[(index+listLength-1) % listLength];
      saveState('playlistState', state);
      document.title = state.song.name;
    },
    shuffle(state) {
      if (state.list && state.list.files) {
        state.list.files = state.list.files.sort(() => Math.random() - 0.5);
      }
    }
  }
});

export const { setCurrentSong, setCurrentList, next, previous, shuffle } = playlistSlice.actions;
export default playlistSlice.reducer;
