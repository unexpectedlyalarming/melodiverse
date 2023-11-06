import React, { useEffect, useState } from "react";
import Container from "./Container";
import useApi from "../hooks/useApi";
import * as Slider from "@radix-ui/react-slider";

export default function CreateSample() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [genre, setGenre] = useState("");
  const [tags, setTags] = useState("");

  const { data: sample, request: createSample } = useApi({
    url: "/samples",
    method: "post",
    body: {
      title,
      description,
      file,
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

  const genreList = genres.map((genre) => {
    return (
      <option key={genre._id} value={genre}>
        {genre}
      </option>
    );
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createSample;
      }}
      className="flex flex-col p-2 gap-5 justify-center items-center"
    >
      <h1 className="text-3xl font-bold">Create Sample</h1>
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
        id="file"
        value={file}
        onChange={(e) => setFile(e.target.value)}
      />
      <label htmlFor="bpm">BPM</label>
      <Slider.Root
        className="w-full h-2"
        onValueChange={(e) => setBpm(e.target.value)}
        defaultValue={[120]}
        max={200}
        step={1}
        min={60}
      >
        <Slider.Track className="h-2 bg-gray-200 rounded-full">
          <Slider.Range className="h-2 bg-blue-500 rounded-full" />
        </Slider.Track>
        <Slider.Thumb className="w-4 h-4 bg-blue-500 rounded-full" />
      </Slider.Root>
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
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// userId: mongoose.Types.ObjectId;
// title: string;
// description: string;
// URL: string;
// format: string;
// bpm?: number;
// key?: Key;
// genre?: string;
// duration: number;
// likes: string[];
// downloads: string[];
// views: string[];
// tags: string[];
// date: Date;
// packs: string[];
// }
