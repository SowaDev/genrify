import React from 'react'
import PlaylistList from '../PlaylistList/PlaylistList';
import './PlaylistBar.css'

class PlaylistBar extends React.Component {
    constructor(props) {
        super(props)
        // this.state = {
        //     playlists: []
        // }
    }

    // componentDidMount() {
    //     let playlists = this.props.onLoad();
    //     this.setState({ playlists: playlists });
    // }

    render() {
        return(
            <div className="PlaylistBar">
                <h2>Your playlists</h2>
                <PlaylistList playlists={this.props.playlists} />
            </div>
        )
    }
}

export default PlaylistBar