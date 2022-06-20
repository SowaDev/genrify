import React from 'react'
import './ChosenGenreBar.css'
import GenreList from '../GenreList/GenreList'

class ChosenGenreBar extends React.Component {

    render() {
        return(
        <div className='ChosenGenreBar'>
            <h2>Added Genres</h2>
            <GenreList genres={this.props.genres} />
        </div>
        )
    }
    
}

export default ChosenGenreBar