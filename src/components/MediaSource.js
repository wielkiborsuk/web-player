import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentList } from '../state/playlistSlice';
import './MediaSource.css';
import { Scrollable } from '@vdjurdjevic/material-scrollbars';
import { List, ListItem, ListItemText } from '@material-ui/core';


class MediaSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: []
    }
  }

  render() {
    const list_items = this.state.lists.map(item =>
      <ListItem button dense={true} key={item.id} selected={this.isListSelected(item)} onClick={() => this.props.dispatch(setCurrentList(item))}>
        <ListItemText primary={item.name} />
      </ListItem>);
    const song_items = this.props.selectedList.files && this.props.selectedList.files.map(item =>
      <ListItem button dense={true} key={item.url} selected={this.isSongSelected(item)} onClick={() => {this.props.dispatch(setCurrentSong(item))}} >
        <ListItemText primary={item.name} />
      </ListItem>);

    const scroll_options = { sizeAutoCapable: false };

    return (
      <div className="MediaSource">
        <Scrollable options={scroll_options}>
          <List> {list_items} </List>
        </Scrollable>
        <Scrollable options={scroll_options}>
          <ul id="songs">{song_items}</ul>
        </Scrollable>
      </div>
      )
  }

  componentDidMount() {
    const url = this.props.base;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({lists: res});
      })
  }

  isListSelected(list) {
    return this.props.selectedList.id === list.id;
  }

  isSongSelected(song) {
    return this.props.selectedSong.url === song.url;
  }
}

export default (props) => {
  const dispatch = useDispatch();
  const list = useSelector(s => s.playlist.list);
  const song = useSelector(s => s.playlist.song);
  if (!props.visible) {
    return '';
  }
  return props.visible && (
    <MediaSource dispatch={dispatch} selectedList={list} selectedSong={song} {...props} />
  )
};

