import React, { useState } from 'react'
import './SearchBar.css'

export default function SearchBar(props) {
  const [term, setTerm] = useState('')
  const { onSearch } = props

  const search = () => onSearch(term)

  const handleTermChange = ({ target }) => setTerm(target.value)

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter A Song, Album, or Artist"
        onChange={handleTermChange}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  )
}
