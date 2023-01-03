import React from 'react'
import './Genre.css'

export default function Genre(props) {
  const { name, quantity, onAddGenre, onRemoveGenre, isRemoval } = props

  const handleClick = () => {
    if (isRemoval) onRemoveGenre(name)
    else onAddGenre(name)
  }

  return (
    <button className="GenreButton" onClick={handleClick}>
      {name} | {quantity}
    </button>
  )
}
