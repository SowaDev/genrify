import React from 'react'
import './Playlist.css'

export default function Playlist(props) {
  const { name, id, total, onGetTracks, onRemove } = props

  const handleClick = () => onGetTracks(id, total)

  const handleHover = () =>
    (document.getElementById(id).style.visibility = 'visible')

  const handleLeave = () =>
    (document.getElementById(id).style.visibility = 'hidden')

  return (
    <div
      className="Playlist"
      onMouseOver={handleHover}
      onMouseOut={handleLeave}
    >
      <div className="Playlist-information">
        <h3 onClick={handleClick}>{name}</h3>
        <div className="Rightside">
          <p>tracks: {total}</p>
          <button
            className="Remove-button"
            id={id}
            onClick={() => onRemove(id, name)}
          >
            x
          </button>
        </div>
      </div>
    </div>
  )
}
