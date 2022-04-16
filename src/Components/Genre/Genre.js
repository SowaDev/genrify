import React from 'react'
import './Genre.css'

class Genre extends React.Component {
    render() {
        return(
        <button className="GenreButton"
            onClick={this.search}>
            {this.props.name}
        </button>
        )
    }
}

export default Genre