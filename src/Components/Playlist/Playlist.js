import React from 'react'
import './Playlist.css'

class Playlist extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        this.props.onGetTracks(this.props.id, this.props.total)
    }

    render() {
        return(
            <div className='Playlist'>
                <div className='Playlist-information'>
                    <h3 onClick={this.handleClick}>{this.props.name}</h3>
                    <p>tracks: {this.props.total}</p>
                </div>
            </div>
        )
    }
}

export default Playlist