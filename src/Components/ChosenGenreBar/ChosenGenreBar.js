import React from 'react'
import './ChosenGenreBar.css'
import GenreList from '../GenreList/GenreList'

export default function ChosenGenreBar(props) {
    const { genres, onRemoveGenre } = props;

    return(
        <div className='ChosenGenreBar'>
            <h2>Added Genres</h2>
            <GenreList genres={genres}
                       onRemoveGenre={onRemoveGenre}
                       isRemoval={true} />
        </div>
        )
}