"use client";
import React, { useEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { AudioVisualizer } from "react-audio-visualize";
import {
  PlayIcon,
  PauseIcon,
  DownloadIcon,
  HeartIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";

export default function AudioPlayer({ sample }) {
  //For visualizer
  const [blob, setBlob] = useState(null);
  const audioRef = useRef(null);
  const visualizerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [likes, setLikes] = useState(sample.likes);

  useEffect(() => {
    fetch(sample.sample)
      .then((audioBlob) => {
        setBlob(audioBlob);
      })
      .catch((err) => console.error(err));
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
  };

  const handleVolumeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.volume = value;
      setVolume(value);
    }
  };

  async function handleDownload(e) {
    e.preventDefault();
    try {
      //Download sample.sample
      const response = await fetch(sample.sample);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileName =
        sample.title + "-" + sample.key + "-" + sample.bpm + "bpm";

      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  }

  const { request: likeSample, data: likeSuccess } = useApi({
    url: `/likes/${sample._id}`,
    method: "post",
  });

  const { data: liked, request: checkLike } = useApi({
    url: `/likes/check/${sample._id}`,
  });

  async function handleLike(e) {
    e.preventDefault();
    try {
      await likeSample();

      await checkLike();
      if (liked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setLikes(sample.likes);
    checkLike();
  }, []);

  function handleShare(e) {
    e.preventDefault();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  }

  return (
    <div className=" text-white flex flex-col justify-center items-center p-5 rounded-md border-2 border-neutral-500  ">
      <Link to={`/sample/${sample._id}`} className="text-white text-md">
        {sample.title}
      </Link>
      <div className="sample-info flex flex-row place-content-around items-center gap-5">
        <Link to={`/user/${sample.userId}`} className="text-white text-sm">
          {sample.username}
        </Link>
        <time className="text-white text-sm">
          Posted {sample?.date?.split("T", 1)}
        </time>
      </div>
      <audio ref={audioRef} src={sample.sample} />
      <div className="flex flex-col justify-center items-center">
        {/* Visualize */}
        {blob && (
          <AudioVisualizer
            ref={visualizerRef}
            blob={blob}
            width={250}
            height={75}
            barWidth={0.5}
            gap={0.5}
            barColor={"#ffffff"}
          />
        )}
      </div>
      <div className="flex flex-col justify-center items-center">
        {/* Controls */}
        <button onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
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
            <Slider.Track className="bg-blackA7 relative grow rounded-full h-2">
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
          <p className="text-white">
            <DownloadIcon onClick={handleDownload} />
          </p>
          <p className="text-white text-md flex flex-row gap-1 items-center justify-center">
            <HeartIcon onClick={handleLike} />
            {likes}
          </p>
          <p className="text-white text-md">
            <Share2Icon onClick={handleShare} />
          </p>
        </div>
      </div>
    </div>
  );
}
