import React from 'react'
import './GenreBar.css'
import GenreList from '../GenreList/GenreList'

class GenreBar extends React.Component {
    // constructor(props) {
    //     super(props)
    //     this.state = {
    //         playlistGenres: [],
    //         newPlaylistGenres: []
    //     }
    // }

    // componentDidUpdate(prevProps, prevState){
    //     if(prevProps.genres !== this.props.genres)
    //         this.setState({ playlistGenres: this.props.genres})
    // }

    render() {
        return(
        <div className='GenreBar'>
            <h2>Genres</h2>
            <GenreList genres={this.props.playlistGenres}/>
            <h2>Added Genres</h2>
            <GenreList genres={this.props.newPlaylistGenres}/>
        </div>
        )
    }
    
}

export default GenreBar