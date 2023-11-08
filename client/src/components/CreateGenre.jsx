import React, { useState } from "react";
import useApi from "../hooks/useApi";

export default function CreateGenre() {
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const { request: createGenre } = useApi({
    url: "/genres",
    method: "post",
    body: {
      genre,
      description,
      coverImage,
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    await createGenre();
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-2 gap-5 justify-center items-center"
    >
      <label htmlFor="genre">Genre</label>
      <input
        type="text"
        name="genre"
        id="genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <label htmlFor="description">Description</label>
      <input
        type="text"
        name="description"
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="coverImage">Cover Image</label>
      <input
        type="file"
        name="coverImage"
        id="coverImage"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Genre
      </button>
    </form>
  );
}
