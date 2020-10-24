import { configureStore } from '@reduxjs/toolkit';
import playlistReducer from './playlistSlice';
import player from './playerSlice';

export default configureStore({
  reducer: {
    playlist: playlistReducer,
    player: player
  }
});
