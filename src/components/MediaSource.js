import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentList } from '../state/playlistSlice';
import './MediaSource.css';

class MediaSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: []
    }
  }

  render() {
    const list_items = this.state.lists.map(item => <li key={item.id} className={this.listElementClass(item)} onClick={() => this.props.dispatch(setCurrentList(item))}>{item.name}</li>);
    const song_items = this.props.selectedList.files && this.props.selectedList.files.map(item => <li key={item.name} className={this.songElementClass(item)} onClick={() => {this.props.dispatch(setCurrentSong(item))}} >{item.name}</li>);
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
    const active = this.props.selectedList === list;
    return active ? "active" : "";
  }

  songElementClass(song) {
    const active = this.props.selectedSong === song;
    return active ? "active": "";
  }
}

export default () => {
  const dispatch = useDispatch();
  const list = useSelector(s => s.playlist.list);
  const song = useSelector(s => s.playlist.song);
  return (
    <MediaSource dispatch={dispatch} selectedList={list} selectedSong={song} />
  )
};

