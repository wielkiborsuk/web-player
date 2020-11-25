import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './playlistSlice';
import player from './playerSlice';
import sources from './sourcesSlice';

export default configureStore({
  reducer: {
    playlist: playlistReducer,
    player: player,
    sources: sources
  }
});
