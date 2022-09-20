import React from 'react'
import ReactDom from 'react-dom'
import './Modal.css'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  backgroundColor: "rgb(0, 126, 252)",
  padding: '50px',
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
}

export default function Modal({ isModalOpen, onClose, children }) {

  if (!isModalOpen) return null;

  return ReactDom.createPortal(
    <>
      <div  style={OVERLAY_STYLES} />
      <div style={MODAL_STYLES}>
        {children}
        <button onClick={onClose} className="mButton">Ok</button>
      </div>
    </>,
    document.getElementById('portal') 
  )
}
