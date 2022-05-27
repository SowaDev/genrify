import React from 'react'
import './GenreBar.css'
import GenreList from '../GenreList/GenreList'

class GenreBar extends React.Component {

    render() {
        return(
        <div className='GenreBar'>
            <h2>Genres</h2>
            <GenreList genres={this.props.playlistGenres}/>
        </div>
        )
    }
    
}

export default GenreBar