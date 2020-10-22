import React from 'react';
import './MediaSource.css';

class MediaSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      selectedList: null,
      songs: [],
      selectedSong: null
    }
  }

  render() {
    const list_items = this.state.lists.map(item => <li key={item.id} className={this.listElementClass(item)} onClick={() => this.setState({selectedList: item.name, songs: item.files})}>{item.name}</li>);
    const song_items = this.state.songs.map(item => <li key={item.name} className={this.songElementClass(item)} onClick={() => {this.setState({selectedSong: item.name}); this.props.selectSong(item)}} >{item.name}</li>);
    return (
      <div className="MediaSource">
        <ul id="lists">{list_items}</ul>
        <ul id="songs">{song_items}</ul>
      </div>
      )
  }

  componentDidMount() {
    fetch('http://localhost:5000/file/')
      .then(res => res.json())
      .then(res => {
        this.setState({lists: res});
      })
  }

  listElementClass(list) {
    const active = this.state.selectedList === list.name;
    return active ? "active" : "";
  }

  songElementClass(song) {
    const active = this.state.selectedSong === song.name;
    return active ? "active": "";
  }
}

export default MediaSource;

