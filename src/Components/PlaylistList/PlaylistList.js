import React from 'react'
import './PlaylistList.css'
import Playlist from '../Playlist/Playlist'

export default function PlaylistList(props) {
    const { playlists, likedTracksTotal, onGetTracks, onGetLikedTracks, onRemove } = props;

    return(
        <div className="PlaylistList">
            <div className='Saved-tracks'>
                <h3 onClick={onGetLikedTracks}>Liked songs</h3>
                <p>tracks: {likedTracksTotal}</p>
            </div>
            {
                playlists.map(playlist => {
                    return <Playlist key={playlist.id}
                                     name={playlist.name}
                                     id={playlist.id}
                                     tracks={playlist.tracks}
                                     total={playlist.total}
                                     onGetTracks={onGetTracks}
                                     onRemove={onRemove}
                                      />
                })
            }
        </div>
    )
}