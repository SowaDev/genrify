import React from 'react'
import ReactDom from 'react-dom'
import './Modal.css'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  backgroundColor: 'rgba(71, 10, 133)',
  padding: '50px',
  zIndex: 1000,
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000,
}

export default function Modal({ isModalOpen, toggleModal, onYes, children }) {
  const handleYes = () => {
    console.log('handle Yes')
    onYes()
    toggleModal()
  }

  const handleNo = () => {
    console.log('handle No')
    toggleModal()
  }

  if (!isModalOpen) return null

  return ReactDom.createPortal(
    <>
      {/* <div portalClassName="Overlay-div" />
      <div portalClassName="Modal"> */}
      <div style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        <p className="mText">{children}</p>
        <div className="Buttonz">
          <button onClick={handleYes} className="mButton">
            Yes
          </button>
          <button onClick={handleNo} className="mButton">
            No
          </button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  )
}
