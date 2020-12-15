import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play, pause, setVolume, setSpeed, setMuted, setDuration, setCurrentTime, saveBookmark, loadBookmark } from '../state/playerSlice';
import { next, previous, shuffle } from '../state/playlistSlice';
import { fetchSource } from '../state/sourcesSlice';
import './Player.css';
import { ButtonGroup, Button, Slider, Box } from '@material-ui/core';
import { SkipNext, SkipPrevious, PlayArrow, Pause, Speed, VolumeOff, VolumeUp, Shuffle, Refresh, Bookmarks, CloudDownload, CloudUpload } from '@material-ui/icons';

class Player extends React.Component {
  render() {
    const playback = this.props.playback;
    const playIcon = playback.playing ? <Pause /> : <PlayArrow />;
    const playAction = playback.playing ? pause : play;
    const muteIcon = playback.muted ? <VolumeOff /> : <VolumeUp />;

    const volume = playback.volume;
    const speed = playback.speed;

    const dispatch = this.props.dispatch;

    return (
      <div className="Player">
        <audio ref={ref => this.player = ref} src={this.props.song.url} muted={playback.muted}></audio>

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
        <p id="title-display">{this.props.song.name}</p>
        <p id="time-display">{this.formatTime(playback.currentTime)}/{this.formatTime(playback.duration)}</p>
      </div>
      )
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.song.url) {
      if (this.props.playback.playing && !prevProps.playback.playing) {
        this.player.play();
      } else if (prevProps.playback.playing && !this.props.playback.playing) {
        this.player.pause();
      } else if (this.props.song.url !== prevProps.song.url && this.props.playback.playing) {
        this.player.play();
      }
    }

    if (prevProps.speed !== this.props.playback.speed) {
      this.player.playbackRate = this.props.playback.speed;
    }
    if (prevProps.playback.volume !== this.props.playback.volume) {
      this.player.volume = this.props.playback.volume;
    }
    const timeDelta = this.props.playback.currentTime - prevProps.playback.currentTime;
    if (timeDelta * timeDelta > 4) {
      this.player.currentTime = this.props.playback.currentTime;
    }
  }

  componentDidMount() {
    const dispatch = this.props.dispatch;
    this.player.addEventListener('timeupdate', e => {
      dispatch(setCurrentTime(e.target.currentTime || 0));
      dispatch(setDuration(e.target.duration || 0));
    });
    this.player.addEventListener('loadedmetadata', e => {
      dispatch(setDuration(e.target.duration || 0));
      this.player.playbackRate = this.props.playback.speed;
      this.player.volume = this.props.playback.volume;
      if (this.props.playback.playing && this.player.paused) {
        this.player.play();
      }
    });
    this.player.addEventListener('play', e => {
      this.props.dispatch(play());
    });
    this.player.addEventListener('pause', e => {
      this.props.dispatch(pause());
    });
    this.player.addEventListener('ended', e => {
      this.props.dispatch(next());
      this.props.dispatch(play());
    });
  }

  componentWillUnmount() {
    this.player.removeEventListener('timeupdate', () => {});
    this.player.removeEventListener('loadedmetadata', () => {});
    this.player.removeEventListener('play', () => {});
    this.player.removeEventListener('pause', () => {});
    this.player.removeEventListener('ended', () => {});
  }

  formatTime(time) {
    if (!time) {
      return "00:00";
    }
    const totalSeconds = Math.round(time);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    return `${hours ? this.zeroPad(hours)+':' : ''}${this.zeroPad(minutes)}:${this.zeroPad(seconds)}`;
  }

  zeroPad(number) {
    return ('0' + number).slice(-2);
  }
}

export default () => {
  const dispatch = useDispatch();
  const song = useSelector(s => s.playlist.song);
  const playback = useSelector(s => s.player);

  return (
    <Player dispatch={dispatch} song={song} playback={playback} />
  );
}
