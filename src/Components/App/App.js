import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props){
    super(props)
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }
  }

  componentDidMount() {
    Spotify.getAccessToken();
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

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults})
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults results={this.state.searchResults} 
                           onAdd={this.addTrack} />
            <Playlist name={this.state.playlistName} 
                      tracks={this.state.playlistTracks}
                      onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;
