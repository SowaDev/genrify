import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import NewPlaylist from '../NewPlaylist/NewPlaylist'
import Spotify from '../../util/Spotify'
import PlaylistBar from '../PlaylistBar/PlaylistBar';
import GenreBar from '../GenreBar/GenreBar';

class App extends React.Component {
  constructor(props){
    super(props)
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
    this.getPlaylists = this.getPlaylists.bind(this)
    this.getTracks = this.getTracks.bind(this)
    this.getLikedTracks = this.getLikedTracks.bind(this)
    // this.getTracksGenres = this.getTracksGenres.bind(this)
    // this.getPlaylistGenres = this.getPlaylistGenres.bind(this)
    this.state = {
      playlists: [],
      searchResults: [],
      playlistName: '',
      playlistTracks: [],
      playlistGenres: new Map(),
      newPlaylistGenres: new Map()
    }
  }

  componentDidMount() {
    Spotify.getAccessToken();
    this.getPlaylists();
  }

  getLikedTracks() {
    Spotify.getLikedTracks().then(likedTracks => {
      return Spotify.getTracksGenres(likedTracks)
    }).then(tracksWithGenres => {
      this.setState({ searchResults: tracksWithGenres })
      return Spotify.getPlaylistGenres(tracksWithGenres)
    }).then(genres => {
      this.setState({ playlistGenres: genres})
    })
  }
  
  addTrack(track){
    let playlist = this.state.playlistTracks
    if(playlist.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    playlist.push(track)
    this.setState({ playlistTracks: playlist })
  }

  removeTrack(track){
    let playlist = this.state.playlistTracks
    playlist = playlist.filter(savedTrack => savedTrack.id !== track.id)
    this.setState({ playlistTracks: playlist})
  }

  updatePlaylistName(name){
    this.setState( {playlistName: name} )
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({ 
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  getPlaylists() {
    Spotify.getPlaylists().then(userPlaylists => {
      this.setState({ playlists: userPlaylists })
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults})
    })
  }

  getTracks(tracksUri) {
    Spotify.getTracks(tracksUri).then(tracks => {
      return Spotify.getTracksGenres(tracks)
    }).then(tracksWithGenres => {
      this.setState({ searchResults: tracksWithGenres})
      return Spotify.getPlaylistGenres(tracksWithGenres)
    }).then(genres => {
      // console.log(genres)
      this.setState({ playlistGenres: genres })
    })
  }

  // getPlaylistGenres(tracks) {
  //   return Spotify.getPlaylistGenres(tracks)
  // }

  // getTracksGenres(tracks) {
  //   return Spotify.getTracksGenres(tracks)
  // }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}
                     onGetLiked={this.getLikedTracks} />
          <div className="Filters">
            <PlaylistBar playlists={this.state.playlists}
                         onGetTracks={this.getTracks}
                         onGetLikedTracks={this.getLikedTracks} />
            <GenreBar playlistGenres={this.state.playlistGenres}
                      newPlaylistGenres={this.state.newPlaylistGenres} />
          </div>
          <div className="Tracks">
            <div className="Search-results">
              <SearchResults results={this.state.searchResults} 
                           onAdd={this.addTrack} />
            </div>
            <div className="New-playlist">
              <GenreBar playlistGenres={this.state.playlistGenres}
                        newPlaylistGenres={this.state.newPlaylistGenres} />
              <NewPlaylist name={this.state.playlistName} 
                        tracks={this.state.playlistTracks}
                        onRemove={this.removeTrack} 
                        onNameChange={this.updatePlaylistName}
                        onSave={this.savePlaylist} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
