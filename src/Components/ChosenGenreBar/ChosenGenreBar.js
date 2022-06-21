import React from 'react'
import './ChosenGenreBar.css'
import GenreList from '../GenreList/GenreList'

class ChosenGenreBar extends React.Component {

    render() {
        return(
        <div className='ChosenGenreBar'>
            <h2>Added Genres</h2>
            <GenreList genres={this.props.genres}
                       onRemoveGenre={this.props.onRemoveGenre}
                       isRemoval={true} />
        </div>
        )
    }
    
}

export default ChosenGenreBar