import React from 'react'
import './GenreList.css'
import Genre from '../Genre/Genre'

class GenreList extends React.Component {
    sortGenres() {
        const sortedGenres = new Map([...this.props.genres].sort((a, b) => b[1] - a[1]))
        console.log(sortedGenres)
        return sortedGenres
    }

    render() {
        return (
            <div>
                {
                    Array.from(this.sortGenres().keys()).map(genre => {
                        return <Genre name={genre}
                                      key={genre}
                                      quantity={this.props.genres.get(genre)} />
                    })
                }
            </div>
        )
    }
}

export default GenreList