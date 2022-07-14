import React from 'react'
import './Playlist.css'

class Playlist extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleHover = this.handleHover.bind(this)
        this.handleLeave = this.handleLeave.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.isHovering = false;
    }

    handleClick(event) {
        this.props.onGetTracks(this.props.id, this.props.total)
    }

    handleHover() {
        this.isHovering = true;
        document.getElementById(this.props.id).style.visibility = 'visible';
    }

    handleLeave() {
        this.isHovering = false;
        document.getElementById(this.props.id).style.visibility = 'hidden';
    }

    handleRemove() {
        this.props.onRemove(this.props.id)   
    }

    render() {
        return(
            <div className='Playlist'
                 onMouseOver={this.handleHover}
                 onMouseOut={this.handleLeave} >
                <div className='Playlist-information'>
                    <h3 onClick={this.handleClick}>{this.props.name}</h3>
                    <div className='Rightside'>
                        <p>tracks: {this.props.total}</p>
                        <button className='Remove-button'
                                id={this.props.id}
                                onClick={this.handleRemove}>x</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Playlist