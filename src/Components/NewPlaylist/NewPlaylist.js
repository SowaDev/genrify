import React from 'react';
import './NewPlaylist.css'
import TrackList from '../TrackList/TrackList'

class NewPlaylist extends React.Component {
    constructor(props) {
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    handleNameChange(event) {
        let newName = event.target.value
        this.props.onNameChange(newName)
    }

    render() {
        return(
            <div className="NewPlaylist">
                <div className="Playlist-information">
                    <input defaultValue={'New Playlist'}
                        onChange={this.handleNameChange} />
                    <p>tracks: {this.props.tracks.length}</p>
                </div>
                <TrackList tracks={this.props.tracks}
                           onRemove={this.props.onRemove}
                           isRemoval={true} />
                <button className="Playlist-save"
                        onClick={this.props.onSave}>
                    SAVE TO SPOTIFY
                </button>
            </div>
        )
    }
}

export default NewPlaylist