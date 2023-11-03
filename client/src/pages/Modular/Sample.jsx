import React from 'react'
import AudioPlayer from '../../components/AudioPlayer'

export default function Sample({sample}) {



    return (
        <div className="sample flex flex-col items-center justify-center">
            <div className="sample-header">
                <p className="sample-name">{sample?.name}</p>
                <p className="sample-username">{sample?.username}</p>
                <time className="sample-date">{sample?.date}</time>

            </div>
            <AudioPlayer/>
                <p className="sample-description">{sample?.description}</p>
            <div className="sample-info">
                <p className="sample-genre">{sample?.genre}</p>
                <p className="sample-key">{sample?.key}</p>
                <p className="sample-bpm">{sample?.bpm}</p>
                <p className="sample-likes">{sample?.likes}</p>
                <p className="sample-downloads">{sample?.downloads}</p>
                <p className="sample-comments">{sample?.comments}</p>
            </div>
            <div className="sample-tags">
                <p className="sample-tag">{sample?.tag}</p>
                </div>
            </div>
    )
}