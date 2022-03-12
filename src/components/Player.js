import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play, pause, setVolume, setSpeed, setMuted, setDuration, setCurrentTime, toggleShowSpeed, toggleShowBookmarks } from '../state/playerSlice';
import { saveBookmark, loadBookmark, loadBookmarks } from '../state/bookmarkSlice';
import { next, previous, shuffle, toggleRepeat } from '../state/playlistSlice';
import { fetchSource, showSettings } from '../state/sourcesSlice';
import './Player.css';
import { formatTime } from './helpers';
import { ButtonGroup, Button, Slider, Box } from '@material-ui/core';
import { SkipNext, SkipPrevious, PlayArrow, Pause, Speed, VolumeOff, VolumeUp, Shuffle, Repeat, Refresh, Bookmarks, CloudDownload, CloudUpload, Settings } from '@material-ui/icons';

export default function Player(props) {
  const dispatch = useDispatch();
  const song = useSelector(s => s.playlist.song);
  const playback = useSelector(s => s.player);
  const repeat = useSelector(s => s.playlist.repeat) || false;
  const player = useRef();
  const prevTime = useRef(0);

  const playIcon = playback.playing ? <Pause /> : <PlayArrow />;
  const playAction = playback.playing ? pause : play;
  const muteIcon = playback.muted ? <VolumeOff /> : <VolumeUp />;

  const volume = playback.volume;
  const speed = playback.speed;
  const showSpeed = playback.showSpeed;
  const showBookmarks = playback.showBookmarks;

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
    if (playback.playing) {
      player.current.play().catch(e => console.log(e));
    } else {
      player.current.pause();
    }
    dispatch(saveBookmark(false));
  }, [playback.playing, song.url, dispatch]);

  useEffect(() => {
    navigator.mediaSession.setActionHandler('nexttrack', () => dispatch(next()));
    navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(previous()));
    navigator.mediaSession.setActionHandler('play', () => dispatch(play()));
    navigator.mediaSession.setActionHandler('pause', () => dispatch(pause()));
  }, [dispatch]);


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
        onEnded={() => { dispatch(next()); dispatch(play()); }}
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
        <Button onClick={() => dispatch(toggleRepeat())} classes={{ root: repeat?"active":""}}><Repeat /></Button>
      </ButtonGroup>

      <ButtonGroup size="small" id="meta-controls">
        <Button variant="outlined" size="small" onClick={() => { dispatch(fetchSource()); dispatch(loadBookmarks()) }}><Refresh /></Button>
        <Button variant="outlined" size="small" onClick={() => dispatch(setMuted(!playback.muted))}>{muteIcon}</Button>
        <Button className={'slider-small'}>
          <Slider min={0} max={1} value={volume} onChange={(e, value) => dispatch(setVolume(value))} step={0.1} title={volume} />
        </Button>
        <Button onClick={() => dispatch(toggleShowSpeed())} classes={{ root: showSpeed?"active":""}}><Speed /></Button>
        {showSpeed &&
        <Button className={'slider-small'}>
          <Slider min={0.5} max={2} value={speed} onChange={(e, value) => dispatch(setSpeed(value))} step={0.1} title={speed} />
        </Button>
        }
        <Button onClick={() => dispatch(toggleShowBookmarks())} classes={{ root: showBookmarks?"active":""}} ><Bookmarks /></Button>
        {showBookmarks && <Button onClick={() => dispatch(saveBookmark(true))}><CloudDownload /></Button>}
        {showBookmarks && <Button onClick={() => dispatch(loadBookmark())}><CloudUpload /></Button>}
        <Button onClick={() => dispatch(showSettings())} ><Settings /></Button>
      </ButtonGroup>
      <p id="title-display">{song.name}</p>
      <p id="time-display">{formatTime(playback.currentTime)}/{formatTime(playback.duration)}</p>
    </div>
    )
}
