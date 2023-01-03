import React, { useState } from 'react'
import PlaylistList from '../PlaylistList/PlaylistList'
import Modal from '../Modal/Modal.js'
import './PlaylistBar.css'

export default function PlaylistBar(props) {
  const {
    playlists,
    likedTracksTotal,
    onGetTracks,
    onGetLikedTracks,
    onRemove,
  } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [playlistNameToRemove, setPlaylistNameToRemove] = useState('')
  const [playlistIdToRemove, setPlaylistIdToRemove] = useState('')

  const handleRemoveClick = (id, playlistName) => {
    setPlaylistNameToRemove(playlistName)
    setPlaylistIdToRemove(id)
    toggleModal()
  }

  const toggleModal = () => setModalOpen(isModalOpen ? false : true)

  return (
    <div className="PlaylistBar">
      <h2>Your playlists</h2>
      <PlaylistList
        playlists={playlists}
        likedTracksTotal={likedTracksTotal}
        onGetTracks={onGetTracks}
        onGetLikedTracks={onGetLikedTracks}
        onRemove={handleRemoveClick}
      />
      <Modal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        playlistId={playlistIdToRemove}
        onYes={() => onRemove(playlistIdToRemove)}
      >
        {`Are you sure to remove ${playlistNameToRemove} playlist?`}
      </Modal>
    </div>
  )
}
