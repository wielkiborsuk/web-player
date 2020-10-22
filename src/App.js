import React from 'react';
import './App.css';
import Player from './components/Player.js'
import MediaSource from './components/MediaSource.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      player: {
        url: '',
        playing: false
      },
      song: {}
    }
    this.setCurrent = this.setCurrent.bind(this);
    this.setPlaying = this.setPlaying.bind(this);
  }

  render() {
    return (
      <div className="App">
        <Player setPlaying={this.setPlaying} current={this.state.player} song={this.state.song} />
        <MediaSource selectSong={this.setCurrent} />
      </div>
      );
  }

  setCurrent(song) {
    this.setState((state) => ({song: song, player: {...state.player, url: song.url}}));
  }

  setPlaying(playing) {
    this.setState((state) => ({player: {...state.player, playing: playing}}));
  }
}

export default App;
