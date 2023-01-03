import React from 'react'
import './GenreBar.css'
import GenreList from '../GenreList/GenreList'

export default function GenreBar(props) {
  const { playlistGenres, onAddGenre } = props

  return (
    <div className="GenreBar">
      <h2>Genres</h2>
      <GenreList
        genres={playlistGenres}
        onAddGenre={onAddGenre}
        isRemoval={false}
      />
    </div>
  )
}
