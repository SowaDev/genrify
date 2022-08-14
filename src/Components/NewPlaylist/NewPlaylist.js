import React from 'react';
import './NewPlaylist.css'
import TrackList from '../TrackList/TrackList'

export default function NewPlaylist(props) {
    const { name, tracks, onRemove, onNameChange, onSave, onRemoveAll } = props;

    const handleNameChange = ({ target }) => onNameChange(target.value)

    return(
        <div className="NewPlaylist">
            <div className="Playlist-information">
                <input defaultValue={'New Playlist'}
                    onChange={handleNameChange} />
                <p>tracks: {tracks.length}</p>
            </div>
            <div className="Buttons">
                <button className="Playlist-save"
                        onClick={onSave}>
                    SAVE TO SPOTIFY
                </button>
                <button className="Remove-all"
                        onClick={onRemoveAll}>
                    Remove all
                </button>   
            </div>
            <TrackList tracks={tracks}
                       onRemove={onRemove}
                       isRemoval={true} />
        </div>
    )
}