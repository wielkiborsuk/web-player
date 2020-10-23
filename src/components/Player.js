import React from 'react';
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
    const playIcon = this.props.current.playing ? faPause : faPlay;
    const muteIcon = this.state.muted ? faVolumeMute : faVolumeUp;

    return (
      <div className="Player">
        <audio ref={ref => this.player = ref} src={this.props.current.url} muted={this.state.muted}></audio>

        <input type="range" min="0" max={this.state.duration} value={this.state.currentTime} onChange={this.setTime} step="1" />
        <button onClick={this.toggle}><FontAwesomeIcon icon={faStepBackward} /></button>
        <button onClick={() => this.props.setPlaying(!this.props.current.playing)}><FontAwesomeIcon icon={playIcon} /></button>
        <button onClick={this.toggle}><FontAwesomeIcon icon={faStepForward} /></button>
        <span>{this.props.song.name}</span>

        <button onClick={() => this.setState((state) => ({muted: !state.muted}))}><FontAwesomeIcon icon={muteIcon} /></button>
        <input type="range" min="0" max="1" value={this.state.volume} onChange={this.setVolume} step="0.1" title={this.state.volume} />
        <button disabled><FontAwesomeIcon icon={faTachometerAlt} /></button>
        <input type="range" min="0.5" max="2" value={this.state.speed} onChange={this.setSpeed} step="0.1" title={this.state.speed} />
        <span>{this.formatTime(this.state.currentTime)}/{this.formatTime(this.state.duration)}</span>
      </div>
      )
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.current.url) {
      if (this.props.current.playing && !prevProps.current.playing) {
        this.player.play();
      } else if (prevProps.current.playing && !this.props.current.playing) {
        this.player.pause();
      } else if (this.props.current.url !== prevProps.current.url && this.props.current.playing) {
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
      this.props.setPlaying(true);
    });
    this.player.addEventListener('pause', e => {
      this.props.setPlaying(false);
    });
  }

  componentWillUnmount() {
    this.player.removeEventListener('timeupdate', () => {});
    this.player.removeEventListener('loadedmetadata', () => {});
    this.player.removeEventListener('play', () => {});
    this.player.removeEventListener('pause', () => {});
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

export default Player;
