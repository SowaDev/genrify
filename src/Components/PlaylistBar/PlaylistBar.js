import React from 'react'
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';
import Modal from '../Modal/Modal.js'
import './PlaylistBar.css'

class PlaylistBar extends React.Component {
    constructor(props) {
        super(props)
        this.getLikedTracksTotal = this.getLikedTracksTotal.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.state = {
            likedTracksTotal: 0,
            isModalOpen: false,
            playlistNameToRemove: '',
            playlistIdToRemove: ''
        }
    }

    componentDidMount() {
        this.getLikedTracksTotal();
    }

    getLikedTracksTotal() {
        Spotify.getLikedTracksTotal().then(totalLikedTracks => {
            this.setState( { likedTracksTotal: totalLikedTracks } )
        })
    }

    async handleRemoveClick(id, name) {
        this.setState({ 
            playlistNameToRemove: name,
            playlistIdToRemove: id})
        this.toggleModal();
    }

    toggleModal() {
        let isOpen = this.state.isModalOpen ? false : true;
        this.setState({ isModalOpen: isOpen })
      }
    
    render() {
        return(
            <div className="PlaylistBar">
                <h2>Your playlists</h2>
                <PlaylistList playlists={this.props.playlists}
                              likedTracksTotal={this.state.likedTracksTotal} 
                              onGetTracks={this.props.onGetTracks}
                              onGetLikedTracks={this.props.onGetLikedTracks}
                              onRemove={this.handleRemoveClick}
                              />
                <Modal isModalOpen={this.state.isModalOpen}
                       toggleModal={this.toggleModal}
                       playlistId={this.state.playlistIdToRemove}
                       onYes={() => this.props.onRemove(this.state.playlistIdToRemove)}>
                            {`Are you sure to remove ${this.state.playlistNameToRemove} playlist?`}
                </Modal>
            </div>
        )
    }
}

export default PlaylistBar