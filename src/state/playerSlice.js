import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCurrentSong } from './playlistSlice';
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

export const saveBookmark = createAsyncThunk('player/saveBookmark', async (payload, { getState }) => {
  const list = getState().playlist.list;
  const song = getState().playlist.song;
  const time = getState().player.currentTime;
  const bookmarkSource = getState().sources.bookmarkSource || '';
  const bookmark = {
    id: list.id,
    name: list.name,
    file: song.name,
    time: time
  }
  //send bookmark to API
  if (bookmarkSource && list.files.find(s => s.name === song.name)) {
    console.log('saving bookmark');
    fetch(bookmarkSource, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    });
  }
});

export const loadBookmark = createAsyncThunk('player/loadBookmark', async (payload, { dispatch, getState }) => {
  const list = getState().playlist.list;
  const bookmarkSource = getState().sources.bookmarkSource || '';
  //send bookmark to API
  if (bookmarkSource) {
    console.log('loading bookmark');
    fetch(bookmarkSource + list.id).then(res => res.json()).then(body => {
      const song = list.files.find(s => s.name === body.file);
      dispatch(setCurrentSong(song));
      dispatch(setCurrentTime(body.time));
    }).catch((error) => {
      console.error('couldnt load the bookmark');
    });
  }
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
    },
    toggleShowBookmarks(state) {
      state.showBookmarks = !state.showBookmarks;
    }
  }
});

export const { play, pause, setVolume, setSpeed, setMuted, setDuration, setCurrentTime, toggleShowSpeed, toggleShowBookmarks } = playerSlice.actions;
export default playerSlice.reducer;
