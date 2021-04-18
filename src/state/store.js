import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import playlistReducer from './playlistSlice';
import player from './playerSlice';
import sources from './sourcesSlice';
import bookmark from './bookmarkSlice';

export default configureStore({
  reducer: {
    playlist: playlistReducer,
    player: player,
    sources: sources,
    bookmark: bookmark
  },
  middleware: [thunk]
});
