import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCurrentSong } from './playlistSlice';

const initialState = JSON.parse(localStorage.getItem('playerState')) || { playing: false, volume: 1, muted: false, currentTime: 0, duration: 0, speed: 1 };

export const saveBookmark = createAsyncThunk('player/saveBookmark', async (payload, { getState }) => {
  console.log('saving bookmark');
  const list = getState().playlist.list;
  const song = getState().playlist.song;
  const time = getState().player.currentTime;
  const bookmark = {
    id: list.id,
    name: list.name,
    file: song.name,
    time: time
  }
  //send bookmark to API
  if (list.files.find(s => s.name === song.name)) {
    fetch('http://localhost:5000/bookmark/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    });
  }
});

export const loadBookmark = createAsyncThunk('player/loadBookmark', async (payload, { dispatch, getState }) => {
  console.log('loading bookmark');
  const list = getState().playlist.list;
  //send bookmark to API
  fetch('http://localhost:5000/bookmark/' + list.id).then(res => res.json()).then(body => {
    const song = list.files.find(s => s.name === body.file);
    dispatch(setCurrentSong(song));
    dispatch(setCurrentTime(body.time));
  }).catch((error) => {
    console.error('couldnt load the bookmark');
  });
});

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
    },
    setMuted(state, action) {
      state.muted = action.payload;
      localStorage.setItem('playerState', JSON.stringify(state));
    },
    setDuration(state, action) {
      state.duration = action.payload;
      localStorage.setItem('playerState', JSON.stringify(state));
    },
    setCurrentTime(state, action) {
      state.currentTime = action.payload;
      localStorage.setItem('playerState', JSON.stringify(state));
    }
  }
});

export const { play, pause, setVolume, setSpeed, setMuted, setDuration, setCurrentTime } = playerSlice.actions;
export default playerSlice.reducer;
