import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('playlistState')) || { list: {}, song: {} };

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setCurrentList(state, action) {
      state.list = action.payload;
      localStorage.setItem('playlistState', JSON.stringify(state));
    },
    setCurrentSong(state, action) {
      state.song = action.payload;
      localStorage.setItem('playlistState', JSON.stringify(state));
    },
    next(state) {
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      state.song = state.list.files[(index+1) % state.list.files.length];
      localStorage.setItem('playlistState', JSON.stringify(state));
    },
    previous(state) {
      const listLength = state.list.files.length;
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      state.song = state.list.files[(index+listLength-1) % listLength];
      localStorage.setItem('playlistState', JSON.stringify(state));
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
