import { createSlice } from '@reduxjs/toolkit';

const initialState = { list: {}, song: {} };

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setCurrentList(state, action) {
      state.list = action.payload;
    },
    setCurrentSong(state, action) {
      state.song = action.payload;
    },
    next(state) {
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      state.song = state.list.files[(index+1) % state.list.files.length];
    },
    previous(state) {
      const listLength = state.list.files.length;
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      state.song = state.list.files[(index+listLength-1) % listLength];
    }
  }
});

export const { setCurrentSong, setCurrentList, next, previous } = playlistSlice.actions;
export default playlistSlice.reducer;
