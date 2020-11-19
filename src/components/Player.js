import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play, pause, setVolume, setSpeed } from '../state/playerSlice';
import { next, previous, shuffle } from '../state/playlistSlice';
import './Player.css';
import { ButtonGroup, Button, Slider, Box } from '@material-ui/core';
import { SkipNext, SkipPrevious, PlayArrow, Pause, Speed, VolumeOff, VolumeUp, Shuffle} from '@material-ui/icons';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      muted: false
    };
    this.setTime = this.setTime.bind(this);
  }

  render() {
    const playIcon = this.props.playback.playing ? <Pause /> : <PlayArrow />;
    const playAction = this.props.playback.playing ? pause : play;
    const muteIcon = this.state.muted ? <VolumeOff /> : <VolumeUp />;

    const volume = this.props.playback.volume;
    const speed = this.props.playback.speed;

    return (
      <div className="Player">
        <audio ref={ref => this.player = ref} src={this.props.song.url} muted={this.state.muted}></audio>

        <Box id="time-scale">
          <Slider min={0} max={this.state.duration} value={this.state.currentTime} onChange={this.setTime} step={1} />
        </Box>
        <ButtonGroup size="small" id="playback-controls">
          <Button onClick={() => this.props.dispatch(previous())}><SkipPrevious /></Button>
          <Button onClick={() => this.props.dispatch(playAction())}>{playIcon}</Button>
          <Button onClick={() => this.props.dispatch(next())}><SkipNext /></Button>
          <Button onClick={() => this.props.dispatch(shuffle())}><Shuffle /></Button>
        </ButtonGroup>

        <Box id="meta-controls">
          <Button variant="outlined" size="small" onClick={() => this.setState((state) => ({muted: !state.muted}))}>{muteIcon}</Button>
          <Box className={'slider-small'}>
            <Slider min={0} max={1} value={volume} onChange={(e, value) => this.props.dispatch(setVolume(value))} step={0.1} title={volume} />
          </Box>
          <Button variant="outlined" size="small" disabled><Speed /></Button>
          <Box className={'slider-small'}>
            <Slider min={0.5} max={2} value={speed} onChange={(e, value) => this.props.dispatch(setSpeed(value))} step={0.1} title={speed} />
          </Box>
        </Box>
        <p id="title-display">{this.props.song.name}</p>
        <p id="time-display">{this.formatTime(this.state.currentTime)}/{this.formatTime(this.state.duration)}</p>
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
  }

  componentDidMount() {
    this.player.addEventListener('timeupdate', e => {
      this.setState({
        currentTime: e.target.currentTime || 0,
        duration: e.target.duration || 0
      });
    });
    this.player.addEventListener('loadedmetadata', e => {
      this.setState({
        currentTime: e.target.currentTime || 0,
        duration: e.target.duration || 0
      });
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

  setTime(e, value) {
    this.setState({currentTime: value});
    this.player.currentTime = value;
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
