import React, { useEffect, useState } from "react";
import Container from "./Container";
import useApi from "../hooks/useApi";
import * as Slider from "@radix-ui/react-slider";

export default function CreateSample() {
  const [hidden, setHidden] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");
  const [tagInput, setTagInput] = useState("");

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
    const tagsArr = tagInput.split(",");
    const newTags = tagsArr.map((tag) => {
      return tag.trim();
    });
    if (!newTags) setTags("");
    setTags(newTags);
  };

  const { data: sample, request: createSample } = useApi({
    url: "/samples",
    method: "post",
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    body: {
      title,
      description,
      sample: file,
      bpm,
      key,
      genre,
      tags,
    },
  });

  const {
    data: genres,
    request: getGenres,
    loading,
  } = useApi({
    url: "/genres",
    method: "get",
  });

  useEffect(() => {
    getGenres();
  }, []);

  if (loading) return <p>Loading...</p>;

  const genreList =
    genres &&
    genres.map((genre) => {
      return (
        <option key={genre._id} value={genre.genre}>
          {genre.genre}
        </option>
      );
    });

  const tagsList = tags
    ? tags.map((tag) => {
        return <p key={tag}>#{tag}</p>;
      })
    : null;
  if (hidden) {
    return (
      <>
        <button onClick={() => setHidden(!hidden)} className="create-sample">
          Create Sample
        </button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => setHidden(!hidden)} className="create-sample">
        Close
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSample();
        }}
        className="create-sample-form"
      >
        <h1>Create Sample</h1>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label htmlFor="file">File</label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="bpm">BPM</label>
        <Slider.Root
          className="create-sample-slider"
          defaultValue={[60]}
          onValueChange={(value) => setBpm(value)}
          max={200}
          min={60}
          step={1}
        >
          <Slider.Track className="slider-track">
            <Slider.Range className="slider-range" />
          </Slider.Track>
          <Slider.Thumb className="slider-thumb" aria-label="Volume" />
        </Slider.Root>
        <p>{bpm} bpm</p>

        <label htmlFor="key">Key</label>
        <select
          name="key"
          id="key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        >
          <option value="C">C</option>
          <option value="C#">C#</option>
          <option value="D">D</option>
          <option value="D#">D#</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="F#">F#</option>
          <option value="G">G</option>
          <option value="G#">G#</option>
          <option value="A">A</option>
          <option value="A#">A#</option>
          <option value="B">B</option>
        </select>

        <label htmlFor="genre">Genre</label>
        <select
          name="genre"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {genreList}
        </select>
        <label htmlFor="tags">Tags (Separated by comma)</label>
        <input
          type="text"
          id="tags"
          value={tagInput}
          onChange={handleTagInput}
        />
        <div className="flex flex-row justify-center items-center gap-2">
          {tagsList}
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
