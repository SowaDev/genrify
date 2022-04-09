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
                                         tracks={playlist.tracks} />
                    })
                }
            </div>
        )
    }
}

export default PlaylistList