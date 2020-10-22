import React from 'react';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0
    };
    this.setTime = this.setTime.bind(this);
  }

  render() {
    return (
      <div className="Player">
        <input type="range" min="0" max={this.state.duration} value={this.state.currentTime} onChange={this.setTime} step="1" />
        <audio ref={ref => this.player = ref} src={this.props.current.url}></audio>
        <button onClick={this.toggle}>prev</button>
        <button onClick={() => this.props.setPlaying(!this.props.current.playing)}>{this.props.current.playing ? 'pause' : 'play'}</button>
        <button onClick={this.toggle}>next</button>
        <span>{this.props.song.name}</span>
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
