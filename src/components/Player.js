import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { play, pause } from '../state/playerSlice';
import { next, previous } from '../state/playlistSlice';
import './Player.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStepBackward, faStepForward, faPlay, faPause, faVolumeUp, faVolumeMute, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0,
      volume: 1,
      muted: false,
      speed: 1
    };
    this.setTime = this.setTime.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setSpeed = this.setSpeed.bind(this);
  }

  render() {
    const playIcon = this.props.playback.playing ? faPause : faPlay;
    const playAction = this.props.playback.playing ? pause : play;
    const muteIcon = this.state.muted ? faVolumeMute : faVolumeUp;

    return (
      <div className="Player">
        <audio ref={ref => this.player = ref} src={this.props.song.url} muted={this.state.muted}></audio>

        <input id="time-scale" type="range" min="0" max={this.state.duration} value={this.state.currentTime} onChange={this.setTime} step="1" />
        <div id="playback-controls">
          <button onClick={() => this.props.dispatch(previous())}><FontAwesomeIcon icon={faStepBackward} /></button>
          <button onClick={() => this.props.dispatch(playAction())}><FontAwesomeIcon icon={playIcon} /></button>
          <button onClick={() => this.props.dispatch(next())}><FontAwesomeIcon icon={faStepForward} /></button>
        </div>

        <div id="meta-controls">
          <button onClick={() => this.setState((state) => ({muted: !state.muted}))}><FontAwesomeIcon icon={muteIcon} /></button>
          <input type="range" min="0" max="1" value={this.state.volume} onChange={this.setVolume} step="0.1" title={this.state.volume} />
          <button disabled><FontAwesomeIcon icon={faTachometerAlt} /></button>
          <input type="range" min="0.5" max="2" value={this.state.speed} onChange={this.setSpeed} step="0.1" title={this.state.speed} />
        </div>
        <span id="title-display">{this.props.song.name}</span>
        <span id="time-display">{this.formatTime(this.state.currentTime)}/{this.formatTime(this.state.duration)}</span>
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

    if (prevState.speed !== this.state.speed) {
      this.player.playbackRate = this.state.speed;
    }
    if (prevState.volume !== this.state.volume) {
      this.player.volume = this.state.volume;
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
      this.player.playbackRate = this.state.speed;
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

  setTime(e) {
    this.setState({currentTime: e.target.value});
    this.player.currentTime = e.target.value;
  }

  setVolume(e) {
    this.setState({volume: e.target.value});
  }

  setSpeed(e) {
    this.setState({speed: e.target.value});
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
