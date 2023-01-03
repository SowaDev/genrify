import React from 'react'
import './TrackList.css'
import Track from '../Track/Track'

export default function TrackList(props) {
  const { tracks, onAdd, onRemove, isRemoval } = props

  return (
    <div className="TrackList">
      {tracks.map((track) => {
        return (
          <Track
            track={track}
            key={track.id}
            onAdd={onAdd}
            onRemove={onRemove}
            isRemoval={isRemoval}
          />
        )
      })}
    </div>
  )
}
