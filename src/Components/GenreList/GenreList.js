import React from 'react'
import './GenreList.css'
import Genre from '../Genre/Genre'

class GenreList extends React.Component {
    render() {
        return (
            <div>
                {
                    // Array.from(this.props.genres.keys).map(genre => {
                    this.props.genres.map(genre => {
                        return <Genre name={genre}
                                      key={genre} />
                    })
                }
            </div>
        )
    }
}

export default GenreList