import React from 'react'
import './Playlist.css'

class Playlist extends React.Component {

    render() {
        return(
            <div className='Playlist'>
                <div className='Playlist-information'>
                    <h3>{this.props.name}</h3>
                    <p>tracks: 22</p>
                </div>
            </div>
        )
    }
}

export default Playlist