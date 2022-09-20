import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import NewPlaylist from '../NewPlaylist/NewPlaylist'
import Spotify from '../../util/Spotify'
import PlaylistBar from '../PlaylistBar/PlaylistBar';
import GenreBar from '../GenreBar/GenreBar';
import ChosenGenreBar from '../ChosenGenreBar/ChosenGenreBar';
import Modal2 from '../Modal/Modal2.js'

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistGenres, setPlaylistGenres] = useState(new Map());
  const [newPlaylistGenres, setNewPlaylistGenres] = useState(new Map());
  const [user, setUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    Spotify.getAccessToken('user-library-read');
    getStarted();
  }, [])

  const getStarted = async() => {
    const appUser = await Spotify.getUser();
    if(!appUser) {
      console.log('bullshit')
      setModalOpen(true);
      return [];
    }
    setUser(appUser);
    setPlaylists(await Spotify.getPlaylists(appUser));
  }
  
  const getLikedTracks = async() => {
    let tracks = await Spotify.getTracksGenres(await Spotify.getLikedTracks());
    setSearchResults(tracks);
    setPlaylistGenres(await Spotify.getPlaylistGenres(tracks));
  }

  const addTracksByGenre = (genre) => {
    let tracksToAdd = searchResults.filter(track => track.genres.includes(genre) && !playlistTracks.includes(track));
    setPlaylistTracks((tracks) => [...tracks, ...tracksToAdd]);
    tracksToAdd.forEach(track => addGenres(track));
  }

  const removeTracksByGenre = (genre) => {
    let removed = playlistTracks.filter(track => track.genres.includes(genre));
    removed.forEach(track => removeGenres(track));
    setPlaylistTracks(playlistTracks.filter(track => !track.genres.includes(genre)));
  }

  const removeGenres = (track) => {
    let chosenGenres = newPlaylistGenres;
    track.genres.forEach(genre => {
      if(chosenGenres.get(genre) !== 1)
        chosenGenres.set(genre, chosenGenres.get(genre) - 1);
      else
        chosenGenres.delete(genre);
    })
    setNewPlaylistGenres(chosenGenres);
  }

  const addGenres = (track) => {
    let chosenGenres = newPlaylistGenres;
    track.genres.forEach(genre => {
      if(!chosenGenres.has(genre))
        chosenGenres.set(genre, 1)
      else
        chosenGenres.set(genre, chosenGenres.get(genre) + 1)
    })
    setNewPlaylistGenres(chosenGenres);
  }

  const addAllTracks = () => {
    setPlaylistTracks(searchResults);
    setNewPlaylistGenres(playlistGenres);
  }

  const addTrack = (track) => {
    if(playlistTracks.find(savedTrack => savedTrack.id === track.id))
      return;
    setPlaylistTracks((tracks) => [...tracks, track]);
    addGenres(track);
  }

  const removeTrack = (track) => {
    setPlaylistTracks(playlistTracks.filter(savedTrack => savedTrack.id !== track.id));
    removeGenres(track);
  }

  const removeAllTracks = () => {
    setPlaylistTracks([]);
    setNewPlaylistGenres(new Map());
  }

  const updatePlaylistName = (text) => setPlaylistName(text);

  const savePlaylist = async() => {
    const trackURIs = playlistTracks.map(track => track.uri);
    let newPlaylist = await Spotify.savePlaylist(user, playlistName, trackURIs);
    setPlaylistName('');
    setPlaylistTracks([]);
    setNewPlaylistGenres(new Map());
    setPlaylists((prev) => {
      return [newPlaylist, ...prev]
    })
  }

  const search = async(term) => {
    let tracks = await Spotify.search(term);
    let tracksWithGenres = await Spotify.getTracksGenres(tracks);
    let genres = await Spotify.getPlaylistGenres(tracksWithGenres);
    setSearchResults(tracksWithGenres);
    setPlaylistGenres(genres);
  }

  const getTracks = async(tracksUri, total) => {
    let tracks = await Spotify.getTracksGenres(await Spotify.getTracks(tracksUri, total));
    setSearchResults(tracks);
    setPlaylistGenres(await Spotify.getPlaylistGenres(tracks));
  }

  const removePlaylist = async(playlistId) => {
    await Spotify.unfollowPlaylist(playlistId);
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  }

  return (
      <div className="App">
        <h1>
          Genrify
          <SearchBar onSearch={search} />
        </h1>
        <div className="Filters">
          <PlaylistBar playlists={playlists}
                       onGetTracks={getTracks}
                       onGetLikedTracks={getLikedTracks}
                       onRemove={removePlaylist}
                        />
          <GenreBar playlistGenres={playlistGenres}
                    newPlaylistGenres={newPlaylistGenres}
                    onAddGenre={addTracksByGenre} />
          <ChosenGenreBar genres={newPlaylistGenres}
                            onRemoveGenre={removeTracksByGenre} />
        </div>
        <div className="Tracks">
          <SearchResults results={searchResults} 
                         onAdd={addTrack}
                         onAddAll={addAllTracks} />
            <NewPlaylist name={playlistName} 
                         tracks={playlistTracks}
                         onRemove={removeTrack} 
                         onNameChange={updatePlaylistName}
                         onSave={savePlaylist}
                         onRemoveAll={removeAllTracks} />
        </div>
        <Modal2 isModalOpen={isModalOpen}
              onClose={() => setModalOpen(false)}>
          {`The app is still in development mode.
            Due to Spotify policy your email has to be added beforehand by the creator of the app.
            Please send an e-mail to fukuroosawa@gmail.com in order to use the app.`}
        </Modal2>
      </div>
  )
}