import React from 'react'
import './GenreList.css'
import Genre from '../Genre/Genre'

export default function GenreList(props) {
  const { genres, onAddGenre, onRemoveGenre, isRemoval } = props

  const sortGenres = () => new Map([...genres].sort((a, b) => b[1] - a[1]))

  return (
    <div>
      {Array.from(sortGenres().keys()).map((genre) => {
        return (
          <Genre
            name={genre}
            key={genre}
            quantity={genres.get(genre)}
            onAddGenre={onAddGenre}
            onRemoveGenre={onRemoveGenre}
            isRemoval={isRemoval}
          />
        )
      })}
    </div>
  )
}
