import { createSlice } from '@reduxjs/toolkit';
import { saveState, loadState } from './helpers';
import { listSelected, refreshList } from './sourcesSlice'

const initialState = loadState('playlistState', {
  list: {},
  song: {},
  repeat: false
});

if (initialState.song.name) {
  document.title = initialState.song.name;
}

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    songSelected(state, action) {
      state.song = action.payload.song;
      state.list = action.payload.list;
      saveState('playlistState', state);
      document.title = state.song.name;
    },
    next(state) {
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      if (state.repeat || index < state.list.files.length - 1) {
        state.song = state.list.files[(index+1) % state.list.files.length];
        saveState('playlistState', state);
        document.title = state.song.name;
      }
    },
    previous(state) {
      const listLength = state.list.files.length;
      const index = state.list.files.findIndex(item => item.name === state.song.name);
      if (state.repeat || index > 0) {
        state.song = state.list.files[(index+listLength-1) % listLength];
        saveState('playlistState', state);
        document.title = state.song.name;
      }
    },
    shuffle(state) {
      if (state.list && state.list.files) {
        state.list.files = state.list.files.sort(() => Math.random() - 0.5);
      }
    },
    toggleRepeat(state) {
      state.repeat = !state.repeat;
      saveState('playlistState', state);
    }
  },
  extraReducers: {
    [listSelected.fulfilled]: (state, action) => {
      if (action.payload && state.list && state.list.id === action.payload.list_id) {
        state.list.files = action.payload.files;
        saveState('playlistState', state);
      }
    },
    [refreshList.fulfilled]: (state, action) => {
      if (state.list && action.payload && action.payload.list && state.list.id === action.payload.list.id) {
        Object.assign(state.list, action.payload.list);
        saveState('playlistState', state);
      }
    }
  }
});

export const { songSelected, next, previous, shuffle, toggleRepeat } = playlistSlice.actions;
export default playlistSlice.reducer;
