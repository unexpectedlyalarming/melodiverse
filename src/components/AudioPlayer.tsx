"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { AudioVisualizer } from 'react-audio-visualize';
import { PlayIcon, PauseIcon, DownloadIcon, HeartIcon, Share2Icon } from '@radix-ui/react-icons';

export default function AudioPlayer () {


    //For visualizer
    const [blob, setBlob] = useState<Blob | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const visualizerRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);


    useEffect(() => {
        fetch("https://file-examples.com/storage/fe1734aff46541d35a76822/2017/11/file_example_MP3_1MG.mp3").then((audioBlob: any) => {
            setBlob(audioBlob);
        }).catch(err => console.error(err))
    }, []);


    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }

    const handleVolumeChange = (value: any) => {
        if (audioRef.current) {
            audioRef.current.volume = value;
            setVolume(value);
        }
    }

    return (
        <div className="bg-gray-800 text-white flex flex-col justify-center items-center p-5 rounded-md border-2 border-white  ">
            <p className="text-white text-md">Sample Name</p>
            <div className="sample-info flex flex-row place-content-around items-center gap-5">
                <a className="text-white text-sm">Username</a>
                <time className="text-white text-sm">Posted x days ago</time>
                </div>
            <audio ref={audioRef} src="./audio/test.mp3" />
            <div className="flex flex-col justify-center items-center">
                {/* Visualize */}
                {blob && (
        <AudioVisualizer
          ref={visualizerRef}
          blob={blob}
          width={250}
          height={75}
          barWidth={.5}
          gap={.5}
          barColor={'#ffffff'}
        />
      )}
                </div>
            <div className="flex flex-col justify-center items-center">
                {/* Controls */}
                <button onClick={togglePlay}>{isPlaying ? <PauseIcon/> : <PlayIcon/>}</button>
               <div className="slider ">

               <p className="text-white text-sm">Volume</p>
                
                <Slider.Root
                    min={0}
                    max={1}
                    step={0.01}
                    value={[volume]}
                    onValueChange={handleVolumeChange}
                    className="relative flex items-center select-none touch-none w-[200px] h-5"
                    > 
      <Slider.Track className="bg-blackA7 relative grow rounded-full h-[3px]">
        <Slider.Range className="absolute bg-white rounded-full h-full" />
      </Slider.Track>
      <Slider.Thumb
        className="block w-5 h-5 bg-white rounded-full focus:shadow-blackA5"
        aria-label="Volume"
        />
    </Slider.Root>
    <p className="text-white text-sm">{Math.round(volume * 100)}</p>
        </div>
        <div className="interactables flex justify-center gap-2 items-center flex-row">
            <p className="text-white text-md"><DownloadIcon /></p>
            <p className="text-white text-md"><HeartIcon/></p>
            <p className="text-white text-md"><Share2Icon/></p>
            </div>
     

            
            </div>
        </div>

    )

}