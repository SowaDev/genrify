import React from 'react'
import './PlaylistList.css'
import Playlist from '../Playlist/Playlist'

class PlaylistList extends React.Component {
    
    render() {
        return(
            <div className="PlaylistList">
                {
                    this.props.playlists.map(playlist => {
                        return <Playlist key={playlist.id}
                                         name={playlist.name}
                                         id={playlist.id}
                                         tracks={playlist.tracks}
                                         onGetTracks={this.props.onGetTracks} />
                    })
                }
            </div>
        )
    }
}

export default PlaylistList