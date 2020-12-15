import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentList } from '../state/playlistSlice';
import { fetchSource } from '../state/sourcesSlice';
import './MediaSource.css';
import { Scrollable, useScrollable } from '@vdjurdjevic/material-scrollbars';
import { List, ListItem, ListItemText } from '@material-ui/core';


export default function MediaSource(props) {
  const dispatch = useDispatch();
  const selectedList = useSelector(s => s.playlist.list);
  const selectedSong = useSelector(s => s.playlist.song);
  const songsScroll = useScrollable();

  useEffect(() => {
    if (!props.lists) {
      dispatch(fetchSource());
    }

    window.requestAnimationFrame(function() {
      if (songsScroll && songsScroll.current) {
        const song = selectedList.files.find((s) => s.url === selectedSong.url);
        const index = selectedList.files.indexOf(song);
        const length = selectedList.files.length;
        const position = index / length * 100 + "%";

        songsScroll.current.instance().scroll({y: position});
      }
    });
  });

  const isListSelected = (list) => {
    return selectedList.id === list.id;
  }

  const isSongSelected = (song) => {
    return selectedSong.url === song.url;
  }

  const lists = props.lists || [];
  const list_items = lists.map(item =>
    <ListItem button dense={true} key={item.id} selected={isListSelected(item)} onClick={() => dispatch(setCurrentList(item))}>
      <ListItemText primary={item.name} />
    </ListItem>);
  const show_songs = !!props.lists.find(list => list.id === selectedList.id);
  const song_items = show_songs && selectedList.files && selectedList.files.map(item =>
    <ListItem button dense={true} key={item.url} selected={isSongSelected(item)} onClick={() => {dispatch(setCurrentSong(item))}} >
      <ListItemText primary={item.name} />
    </ListItem>);

  const scroll_options = { sizeAutoCapable: false };

  return props.visible && (
    <div className="MediaSource">
      <Scrollable options={scroll_options}>
        <List> {list_items} </List>
      </Scrollable>
        <Scrollable options={scroll_options} ref={songsScroll}>
        <ul id="songs">{song_items}</ul>
      </Scrollable>
    </div>
    )
}
