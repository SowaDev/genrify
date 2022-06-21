import React from 'react'
import './Genre.css'

class Genre extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event) {
        if(this.props.isRemoval)
            this.props.onRemoveGenre(this.props.name)
        else
            this.props.onAddGenre(this.props.name)
    }

    render() {
        return(
        <button className="GenreButton"
            onClick={this.handleClick}>
            {this.props.name} | {this.props.quantity}
        </button>
        )
    }
}

export default Genre