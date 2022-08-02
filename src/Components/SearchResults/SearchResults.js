import React from 'react';
import './SearchResults.css'
import TrackList from '../TrackList/TrackList'

export default function SearchResults (props) {
    const { results, onAdd, onAddAll } = props;

    return(
        <div className="SearchResults">
            <div className="Header">
                <h2>Results</h2>
                <button className="Add-all"
                        onClick={onAddAll}>
                    + all
                </button>
            </div>
            <TrackList tracks={results} 
                       onAdd={onAdd} 
                       isRemoval={false}/>
        </div>
    )
}