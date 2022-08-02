import React from 'react';
import './Track.css'

export default function Track(props) {

    const { track, onAdd, onRemove, isRemoval } = props;

    const addTrack = () => onAdd(track);

    const removeTrack = () => onRemove(track);

    const renderAction = () => {
        return <button className="Track-action"
                       onClick={isRemoval ? removeTrack : addTrack}>
                    {isRemoval ? '-' : '+'}
                </button>
    }

    return(
        <div className="Track">
            <div className="Track-information">
                <h3>{track.name}</h3>
                <p>{track.artist} | {track.album}</p>
            </div>
            {renderAction()}
        </div>
    )
}