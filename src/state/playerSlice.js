import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('playerState')) || { playing: false, volume: 1, speed: 1 };

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play(state) {
      state.playing = true;
      localStorage.setItem('playerState', JSON.stringify(state));
    },
    pause(state) {
      state.playing = false;
      localStorage.setItem('playerState', JSON.stringify(state));
    },
    setVolume(state, action) {
      state.volume = action.payload;
      localStorage.setItem('playerState', JSON.stringify(state));
    },
    setSpeed(state, action) {
      state.speed = action.payload;
      localStorage.setItem('playerState', JSON.stringify(state));
    }
  }
});

export const { play, pause, setVolume, setSpeed } = playerSlice.actions;
export default playerSlice.reducer;
