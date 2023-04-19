import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, setCurrentList } from '../state/playlistSlice';
import { fetchSource } from '../state/sourcesSlice';
import './MediaSource.css';
import { Scrollable, useScrollable } from 'nice-scrollbars';
import { List, ListItem, ListItemText, ListItemSecondaryAction, Badge } from '@material-ui/core';


export default function MediaSource(props) {
  const dispatch = useDispatch();
  const selectedListState = useSelector(s => s.playlist.list);
  const selectedSong = useSelector(s => s.playlist.song);
  const sourcesLists = useSelector(s => s.sources.sources[props.index].lists);
  const currentSourceIndex = useSelector(s => s.sources.current);
  const bookmarks = useSelector(s => s.bookmark.bookmarks);

  const selectedList = sourcesLists?.find(list => list.id === selectedListState.id) || selectedListState;

  const songsScroll = useScrollable();

  useEffect(() => {
    if (props.index === currentSourceIndex && !sourcesLists) {
      dispatch(fetchSource());
    }

    window.requestAnimationFrame(function() {
      if (songsScroll &&  songsScroll.current && selectedList && selectedList.files) {
        let song = selectedList.files.find((s) => s.url === selectedSong.url);

        if (!song) {
          song = selectedList.files[bookmarkIndex(selectedList, bookmarks)];
        }

        if (song) {
          const el = document.getElementById(song.url);
          songsScroll.current.instance().scroll({el: el, scroll: "ifneeded", margin: 50});
        }
      }
    });
  });

  useEffect(() => {
    if (selectedListState.id && sourcesLists) {
      const foundList = sourcesLists.find(l => l.id === selectedListState.id);
      if (foundList) {
        dispatch(setCurrentList(foundList));
      }
    }
  }, [sourcesLists, dispatch, selectedListState.id]);

  const isListSelected = (list) => {
    return selectedList.id === list.id;
  }

  const isSongSelected = (song) => {
    return selectedSong.url === song.url;
  }

  const newSongCount = (list, bookmarks) => {
    const mark = list.is_book ? bookmarks[list.id] : null;
    if (mark) {
      const idx = list.files.findIndex(s => s.name === mark.file);
      return list.files.length - idx - 1;
    }
    return 0;
  }

  const bookmarkIndex = (list, bookmarks) => {
    const mark = list.is_book ? bookmarks[list.id] : null;
    if (mark) {
      return list.files.findIndex(s => s.name === mark.file);
    }
    return -1;
  }

  const lists = sourcesLists || [];
  const list_items = lists.map(item =>
    <ListItem button dense={true} key={item.id} selected={isListSelected(item)} onClick={() => dispatch(setCurrentList(item))}>
      <ListItemText primary={item.name} />
      <ListItemSecondaryAction>
        <Badge classes={{badge: 'badge-center'}} badgeContent={newSongCount(item, bookmarks)} color="primary">
          &nbsp;
        </Badge>
      </ListItemSecondaryAction>
    </ListItem>);
  const show_songs = !!lists.find(list => list.id === selectedList.id);
  const markIndex = (selectedList?.files?.length || 0) - 1 - newSongCount(selectedList, bookmarks);
  const song_items = show_songs && selectedList.files && selectedListState.files.map((item, index) =>
    <ListItem button dense={true} id={item.url} key={item.url} selected={isSongSelected(item)} onClick={() => {dispatch(setCurrentSong(item))}} >
      <Badge variant="dot" anchorOrigin={{vertical: 'top', horizontal: 'left'}} classes={{badge: 'dot-center'}} badgeContent={Math.max(index-markIndex, 0)} color="primary">
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
