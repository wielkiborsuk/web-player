import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentList } from '../state/playlistSlice';
import { fetchSource } from '../state/sourcesSlice';
import './MediaSource.css';
import { Scrollable } from '@vdjurdjevic/material-scrollbars';
import { List, ListItem, ListItemText } from '@material-ui/core';


class MediaSource extends React.Component {
  render() {
    const lists = this.props.lists || [];
    const list_items = lists.map(item =>
      <ListItem button dense={true} key={item.id} selected={this.isListSelected(item)} onClick={() => this.props.dispatch(setCurrentList(item))}>
        <ListItemText primary={item.name} />
      </ListItem>);
    const show_songs = !!this.props.lists.find(list => list.id === this.props.selectedList.id);
    const song_items = show_songs && this.props.selectedList.files && this.props.selectedList.files.map(item =>
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
    if (!this.props.lists) {
      this.props.dispatch(fetchSource());
    }
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

