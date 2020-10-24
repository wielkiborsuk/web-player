import { createSlice } from '@reduxjs/toolkit';

const initialState = { playing: false };

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play(state) {
      state.playing = true;
    },
    pause(state) {
      state.playing = false;
    }
  }
});

export const { play, pause } = playerSlice.actions;
export default playerSlice.reducer;
