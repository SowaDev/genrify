import React from 'react'
import './GenreList.css'
import Genre from '../Genre/Genre'

class GenreList extends React.Component {
    sortGenres() {
        const sortedGenres = new Map([...this.props.genres].sort((a, b) => b[1] - a[1]))
        return sortedGenres
    }

    render() {
        return (
            <div>
                {
                    Array.from(this.sortGenres().keys()).map(genre => {
                        return <Genre name={genre}
                                      key={genre}
                                      quantity={this.props.genres.get(genre)}
                                      onAddGenre={this.props.onAddGenre}
                                      onRemoveGenre={this.props.onRemoveGenre}
                                      isRemoval={this.props.isRemoval} />
                    })
                }
            </div>
        )
    }
}

export default GenreList