import React from 'react'
import './PlaylistList.css'
import Playlist from '../Playlist/Playlist'

class PlaylistList extends React.Component {
    
    render() {
        return(
            <div className="PlaylistList">
                <div className='Saved-tracks'>
                    <h3 onClick={this.props.onGetLikedTracks}>Liked songs</h3>
                    <p>tracks: {this.props.likedTracksTotal}</p>
                </div>
                {
                    this.props.playlists.map(playlist => {
                        return <Playlist key={playlist.id}
                                         name={playlist.name}
                                         id={playlist.id}
                                         tracks={playlist.tracks}
                                         total={playlist.total}
                                         onGetTracks={this.props.onGetTracks}
                                         onRemove={this.props.onRemove}
                                          />
                    })
                }
            </div>
        )
    }
}

export default PlaylistList