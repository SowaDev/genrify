import React from 'react'
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';
import './PlaylistBar.css'

class PlaylistBar extends React.Component {
    constructor(props) {
        super(props)
        this.getLikedTracksTotal = this.getLikedTracksTotal.bind(this);
        this.state = {
            likedTracksTotal: 0
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

    render() {
        return(
            <div className="PlaylistBar">
                <h2>Your playlists</h2>
                <PlaylistList playlists={this.props.playlists}
                              likedTracksTotal={this.state.likedTracksTotal} 
                              onGetTracks={this.props.onGetTracks}
                              onGetLikedTracks={this.props.onGetLikedTracks} />
            </div>
        )
    }
}

export default PlaylistBar