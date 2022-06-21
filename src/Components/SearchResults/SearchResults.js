import React from 'react';
import './SearchResults.css'
import TrackList from '../TrackList/TrackList'

class SearchResults extends React.Component {
    render() {
        return(
            <div className="SearchResults">
                <div className="Header">
                    <h2>Results</h2>
                    <button className="Add-all"
                            onClick={this.props.onAddAll}>
                        add all songs
                    </button>
                </div>
                <TrackList tracks={this.props.results} 
                           onAdd={this.props.onAdd} 
                           isRemoval={false}/>
            </div>
        )
    }
}

export default SearchResults