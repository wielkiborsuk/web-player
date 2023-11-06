import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { songSelected } from '../state/playlistSlice';
import { play } from '../state/playerSlice';
import { fetchSource, listSelected } from '../state/sourcesSlice';
import { loadBookmark } from '../state/bookmarkSlice';

import './MediaSource.css';
import { Scrollable, useScrollable } from 'nice-scrollbars';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Badge } from '@material-ui/core';


export default function MediaSource(props) {
  const dispatch = useDispatch();
  const selectedSong = useSelector(s => s.playlist.song);
  const source = useSelector(s => s.sources.sources[props.index]);
  const currentSourceIndex = useSelector(s => s.sources.current);
  const unfinishedOnly = useSelector(s => s.sources.unfinishedOnly) || false;

  const selectedList = source.lists?.find(list => list.id === source.selectedList);

  const songsScroll = useScrollable();

  useEffect(() => {
    if (props.index === currentSourceIndex && !source.lists) {
      dispatch(fetchSource());
    }

    window.requestAnimationFrame(function() {
      if (songsScroll &&  songsScroll.current && selectedList && selectedList.files) {
        let song = selectedList.files.find((s) => s.url === selectedSong.url);

        if (!song) {
          song = selectedList.files[bookmarkIndex(selectedList)];
        }

        if (song) {
          const el = document.getElementById(song.url);
          songsScroll.current.instance().scroll({el: el, scroll: "ifneeded", margin: 50});
        }
      }
    });
  });

  useEffect(() => {
    if (selectedList && !selectedList.files) {
      dispatch(listSelected(selectedList));
    }
  }, [selectedList, dispatch]);

  const isListSelected = (list) => {
    return list && source.selectedList === list.id;
  }

  const isSongSelected = (song) => {
    return selectedSong.url === song.url;
  }

  const newSongCount = (list) => {
    if (list && list.is_book && list.state && !list.state.finished)
      return list.state.unread;
    return 0;
  }

  const bookmarkIndex = (list) => {
    if (list && list.is_book && list.files && list.bookmark && list.bookmark.file) {
      return list.files.findIndex(s => s.name === list.bookmark.file);
    }
    return -1;
  }

  const lists = source.lists || [];
  const list_items = lists.map(item =>
    (!item.is_book || !unfinishedOnly || !item.state.finished || isListSelected(item)) &&
    <ListItem button dense={true} key={item.id} selected={isListSelected(item)} onClick={() => dispatch(listSelected(item))}>
      <ListItemText primary={item.name} />
      <ListItemSecondaryAction>
        <Badge classes={{badge: 'badge-center'}} badgeContent={newSongCount(item)} color="primary" onClick={() => dispatch(loadBookmark(item))}>
          &nbsp;
        </Badge>
      </ListItemSecondaryAction>
    </ListItem>);
  const markIndex = bookmarkIndex(selectedList);
  const song_items = isListSelected(selectedList) && selectedList.files && selectedList.files.map((item, index) =>
    <ListItem button dense={true} id={item.url} key={item.url} selected={isSongSelected(item)} onClick={() => {dispatch(songSelected({song: item, list: selectedList})); dispatch(play());}} >
      <Badge variant="dot" anchorOrigin={{vertical: 'top', horizontal: 'left'}} classes={{badge: 'dot-center'}} badgeContent={index-markIndex} invisible={!selectedList.is_book || (index < markIndex)} color={index > markIndex ? "primary" : "secondary"}>
        &nbsp;
      </Badge>
      <ListItemText primary={item.name} />
    </ListItem>);

  const scroll_options = { sizeAutoCapable: false };

  return props.index === currentSourceIndex && (
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
