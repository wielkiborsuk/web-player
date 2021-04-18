import { createSlice } from '@reduxjs/toolkit';
import { loadState, saveState } from './helpers';

const initialState = loadState('playerState', {
  playing: false,
  volume: 1,
  muted: false,
  currentTime: 0,
  duration: 0,
  speed: 1,
  showSpeed: false,
  showBookmarks: false
});

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play(state) {
      state.playing = true;
      saveState('playerState', state);
    },
    pause(state) {
      state.playing = false;
      saveState('playerState', state);
    },
    setVolume(state, action) {
      state.volume = action.payload;
      saveState('playerState', state);
    },
    setSpeed(state, action) {
      state.speed = action.payload;
      saveState('playerState', state);
    },
    setMuted(state, action) {
      state.muted = action.payload;
      saveState('playerState', state);
    },
    setDuration(state, action) {
      state.duration = action.payload;
      saveState('playerState', state);
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
      saveState('playerState', state);
    },
    toggleShowSpeed(state) {
      state.showSpeed = !state.showSpeed;
      saveState('playerState', state);
    },
    toggleShowBookmarks(state) {
      state.showBookmarks = !state.showBookmarks;
      saveState('playerState', state);
    }
  }
});

export const { play, pause, setVolume, setSpeed, setMuted, setDuration, setCurrentTime, toggleShowSpeed, toggleShowBookmarks } = playerSlice.actions;
export default playerSlice.reducer;
