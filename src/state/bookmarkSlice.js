import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCurrentSong } from './playlistSlice';
import { setCurrentTime, toggleShowBookmarks } from './playerSlice';
import { loadState, saveState } from './helpers';

const initialState = loadState('bookmarkState', {
  bookmarks: [],
  bookmarkAlertOpen: false,
  bookmarkAlertMessage: 'Newer bookmark exists'
});

export const saveBookmark = createAsyncThunk('player/saveBookmark', async (overwrite, { dispatch, getState }) => {
  const list = getState().playlist.list;
  const song = getState().playlist.song;
  const time = getState().player.currentTime;
  const syncSource = getState().sources.syncSource || '';
  const bookmark = {
    id: list.id,
    name: list.name,
    file: song.name,
    time: time
  }
  //send bookmark to API
  if (syncSource && list.files.find(s => s.name === song.name)) {
    const bookmarkUrl = syncSource + 'bookmark/' + (overwrite ? '?overwrite=true' : '')
    fetch(bookmarkUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookmark)
    }).then((response)=>{
      if (response.status === 409) {
        return response.json();
      }
    }).then(body => {
      if (body) {
        dispatch(setBookmarkAlertMessage('current bookmark in ' + body.file + ' at ' + body.time));
        dispatch(setBookmarkAlertOpen(true));
      }
    }).catch((error) => {
      console.error('couldnt save bookmark');
    }).finally(() => {
      dispatch(loadBookmarks());
    });
  }
});

export const loadBookmark = createAsyncThunk('player/loadBookmark', async (payload, { dispatch, getState }) => {
  const list = getState().playlist.list;
  const syncSource = getState().sources.syncSource || '';
  //send bookmark to API
  if (syncSource) {
    fetch(syncSource + 'bookmark/' + list.id).then(res => res.json()).then(body => {
      const song = list.files.find(s => s.name === body.file);
      dispatch(setCurrentSong(song));
      dispatch(setCurrentTime(body.time));
    }).catch((error) => {
      console.error('couldnt load the bookmark');
    });
  }
});

export const loadBookmarks = createAsyncThunk('player/loadBookmarks', async (payload, { dispatch, getState }) => {
  const syncSource = getState().sources.syncSource || '';
  if (syncSource) {
    fetch(syncSource + 'bookmark/').then(res => res.json()).then(body => {
      const bookmarkMap = body.reduce((map, mark) => {
        map[mark.id] = mark;
        return map;
      }, {});
      dispatch(setBookmarks(bookmarkMap));
    }).catch((error) => {
      console.error('couldnt load the bookmark list');
    });
  }
});

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    setBookmarkAlertMessage(state, action) {
      state.bookmarkAlertMessage = action.payload;
      saveState('bookmarkState', state);
    },
    setBookmarkAlertOpen(state, action) {
      state.bookmarkAlertOpen = action.payload;
      saveState('bookmarkState', state);
    },
    setBookmarks(state, action) {
      state.bookmarks = action.payload;
      saveState('bookmarkState', state);
    }
  }
});

export const { setBookmarkAlertMessage, setBookmarkAlertOpen, setBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
