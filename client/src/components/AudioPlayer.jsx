"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import ServerURL from "../variables/URLs";

export default function AudioPlayer({ sample }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
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
      // const response = await fetch(sample.sample);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // const fileName =
      //   sample.title + "-" + sample.key + "-" + sample.bpm + "bpm";

      // a.download = fileName;
      // document.body.appendChild(a);
      // a.click();
      // a.remove();

      const response = await axios.get(
        ServerURL + `/samples/download/${sample._id}`,
        { responseType: "blob", withCredentials: true }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
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

  const { request: likeSample } = useApi({
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

  async function handleDelete() {
    try {
      await axios.delete(ServerURL + `/samples/${sample._id}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleEdit() {
    try {
      navigate(`/sample/edit/${sample._id}`);
    } catch (err) {
      console.error(err);
    }
  }

  const ownerControls = (
    <>
      <button onClick={handleDelete} className="owner-control">
        Delete
      </button>
      <button onClick={handleEdit} className="owner-control">
        Edit
      </button>
    </>
  );

  return (
    <div className="sample-container">
      <Link to={`/sample/${sample._id}`} className="">
        {sample.title}
      </Link>
      <div className="sample-info">
        <Link to={`/profile/${sample.userId}`} className="">
          {sample.username}
        </Link>
        <time className="">Posted {sample?.date?.split("T", 1)}</time>
      </div>
      <audio ref={audioRef} src={sample.sample} />
      <div className="audio-visualizer">
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
      <div className="sample-controls">
        {/* Controls */}
        <button onClick={togglePlay}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="slider">
          <p>Volume</p>

          <Slider.Root
            min={0}
            max={1}
            step={0.01}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="slider-root"
          >
            <Slider.Track className="slider-track">
              <Slider.Range className="slider-range" />
            </Slider.Track>
            <Slider.Thumb className="slider-thumb" aria-label="Volume" />
          </Slider.Root>
          <p className="">{Math.round(volume * 100)}</p>
        </div>
        <div className="audio-info">
          <p>Key: {sample.key}</p>
          <p>BPM: {sample.bpm}</p>
          <p>Genre: {sample.genre}</p>
        </div>
        <div className="interactables">
          <p>
            <DownloadIcon onClick={handleDownload} />
            {sample.downloads}
          </p>
          <p>
            <HeartIcon onClick={handleLike} />
            {likes}
          </p>
          <p>
            <Share2Icon onClick={handleShare} />
          </p>
          {sample.userId === user?._id && ownerControls}
        </div>
      </div>
    </div>
  );
}
