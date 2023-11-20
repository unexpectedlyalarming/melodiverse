import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router";
import { Slider } from "@radix-ui/react-slider";

export default function EditSample() {
  const { id } = useParams();

  const {
    data: sample,
    request: getSample,
    loading,
  } = useApi({
    url: "/samples/" + id,
    method: "get",
  });

  const { data: newSample, request: editSample } = useApi({
    url: "/samples/" + id,
    method: "post",
  });

  useEffect(() => {
    getSample();
  }, []);

  const { data: genres, request: getGenres } = useApi({
    url: "/genres",
    method: "get",
  });

  useEffect(() => {
    getGenres();
  }, []);

  const [title, setTitle] = useState(sample?.title);
  const [description, setDescription] = useState(sample?.description);
  const [bpm, setBpm] = useState(sample?.bpm);
  const [key, setKey] = useState(sample?.key);
  const [genre, setGenre] = useState(sample?.genre);
  const [tags, setTags] = useState(sample?.tags);
  const [tagInput, setTagInput] = useState("");

  if (loading) return <p>Loading...</p>;

  const genreList =
    genres &&
    genres.map((genre) => {
      return (
        <option key={genre._id} value={genre.gebre}>
          {genre.genre}
        </option>
      );
    });

  const tagsList = tags
    ? tags.map((tag) => {
        return <p key={tag}>#{tag}</p>;
      })
    : null;

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
    const tagsArr = tagInput.split(",");
    const newTags = tagsArr.map((tag) => {
      return tag.trim();
    });
    if (!newTags) setTags("");
    setTags(newTags);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editSample({
      title,
      description,
      bpm,
      key,
      genre,
      tags,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editSample();
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
      <label htmlFor="bpm">BPM</label>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-[200px] h-5"
        defaultValue={[60]}
        onValueChange={(value) => setBpm(value)}
        max={200}
        min={60}
        step={1}
      >
        <Slider.Track className="bg-black relative grow rounded-full h-[3px]">
          <Slider.Range className="absolute bg-white rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA4 rounded-[10px]  focus:outline-none "
          aria-label="Volume"
        />
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
      <input type="text" id="tags" value={tagInput} onChange={handleTagInput} />
      <div className="flex flex-row justify-center items-center gap-2">
        {tagsList}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
