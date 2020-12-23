import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play, pause, setVolume, setSpeed, setMuted, setDuration, setCurrentTime, saveBookmark, loadBookmark } from '../state/playerSlice';
import { next, previous, shuffle } from '../state/playlistSlice';
import { fetchSource } from '../state/sourcesSlice';
import './Player.css';
import { formatTime } from './helpers';
import { ButtonGroup, Button, Slider, Box } from '@material-ui/core';
import { SkipNext, SkipPrevious, PlayArrow, Pause, Speed, VolumeOff, VolumeUp, Shuffle, Refresh, Bookmarks, CloudDownload, CloudUpload } from '@material-ui/icons';

export default function Player(props) {
  const dispatch = useDispatch();
  const song = useSelector(s => s.playlist.song);
  const playback = useSelector(s => s.player);
  const player = useRef();
  const prevTime = useRef(0);

  const playIcon = playback.playing ? <Pause /> : <PlayArrow />;
  const playAction = playback.playing ? pause : play;
  const muteIcon = playback.muted ? <VolumeOff /> : <VolumeUp />;

  const volume = playback.volume;
  const speed = playback.speed;

  useEffect(() => {
    const timeDelta = playback.currentTime - prevTime.current;
    if (timeDelta * timeDelta > 4) {
      player.current.currentTime = playback.currentTime;
    }
    prevTime.current = playback.currentTime;
  }, [playback.currentTime]);

  useEffect(() => {
    player.current.playbackRate = playback.speed;
  }, [playback.speed]);

  useEffect(() => {
    player.current.volume = playback.volume;
  }, [playback.volume]);

  useEffect(() => {
    if (song.url) {
      if (playback.playing) {
        player.current.play().catch(e => console.log(e));
      } else {
        player.current.pause();
      }
    }
  }, [playback.playing, song.url]);

  const timeupdate = (event) => {
      dispatch(setCurrentTime(event.target.currentTime || 0));
      dispatch(setDuration(event.target.duration || 0));
  };

  const playerInit = (event) => {
      dispatch(setDuration(event.target.duration || 0));
      player.current.playbackRate = playback.speed;
      player.current.volume = playback.volume;
  }

  return (
    <div className="Player">
      <audio
        ref={player}
        src={song.url}
        muted={playback.muted}
        onPlay={() => dispatch(play())}
        onPause={() => dispatch(pause())}
        onEnded={() => { dispatch(next()); dispatch(play()) }}
        onTimeUpdate={timeupdate}
        onLoadedMetadata={playerInit}
      >
      </audio>

      <Box id="time-scale">
        <Slider min={0} max={playback.duration} value={playback.currentTime} onChange={(e, value) => dispatch(setCurrentTime(value))} step={1} />
      </Box>
      <ButtonGroup size="small" id="playback-controls">
        <Button onClick={() => dispatch(previous())}><SkipPrevious /></Button>
        <Button onClick={() => dispatch(playAction())}>{playIcon}</Button>
        <Button onClick={() => dispatch(next())}><SkipNext /></Button>
        <Button onClick={() => dispatch(shuffle())}><Shuffle /></Button>
      </ButtonGroup>

      <Box id="meta-controls">
        <Button variant="outlined" size="small" onClick={() => dispatch(fetchSource())}><Refresh /></Button>
        <Button variant="outlined" size="small" onClick={() => dispatch(setMuted(!playback.muted))}>{muteIcon}</Button>
        <Box className={'slider-small'}>
          <Slider min={0} max={1} value={volume} onChange={(e, value) => dispatch(setVolume(value))} step={0.1} title={volume} />
        </Box>
        <Button variant="outlined" size="small" disabled><Speed /></Button>
        <Box className={'slider-small'}>
          <Slider min={0.5} max={2} value={speed} onChange={(e, value) => dispatch(setSpeed(value))} step={0.1} title={speed} />
        </Box>
        <ButtonGroup size="small">
          <Button><Bookmarks /></Button>
          <Button><CloudDownload onClick={() => dispatch(saveBookmark())} /></Button>
          <Button><CloudUpload onClick={() => dispatch(loadBookmark())} /></Button>
        </ButtonGroup>
      </Box>
      <p id="title-display">{song.name}</p>
      <p id="time-display">{formatTime(playback.currentTime)}/{formatTime(playback.duration)}</p>
    </div>
    )
}
