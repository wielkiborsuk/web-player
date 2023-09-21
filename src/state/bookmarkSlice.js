import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { songSelected } from './playlistSlice';
import { play, setCurrentTime } from './playerSlice';
import { loadState, saveState } from './helpers';
import { refreshList } from './sourcesSlice';

const initialState = loadState('bookmarkState', {
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
  if (syncSource && list.is_book && list.files.find(s => s.name === song.name)) {
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
      dispatch(refreshList(list.id));
    });
  }
});

export const loadBookmark = createAsyncThunk('player/loadBookmark', async (payload, { dispatch, getState }) => {
  const list = getState().playlist.list;
  const syncSource = getState().sources.syncSource || '';
  //send bookmark to API
  if (syncSource && list && list.is_book) {
    fetch(syncSource + 'bookmark/' + list.id).then(res => res.json()).then(body => {
      const song = list.files.find(s => s.name === body.file);
      dispatch(songSelected({song: song, list: list}));
      dispatch(setCurrentTime(body.time));
      dispatch(play());
    }).catch((error) => {
      console.error('couldnt load the bookmark');
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
    }
  }
});

export const { setBookmarkAlertMessage, setBookmarkAlertOpen } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
