import React, { useEffect } from "react";
import useApi from "../hooks/useApi";

export default function GenresList() {
  const {
    data: genres,
    loading,
    request,
  } = useApi({
    url: "/genres",
    method: "get",
  });

  useEffect(() => {
    request();
  }, []);

  if (loading) return <div>Loading...</div>;

  const genreList = genres.map((genre) => {
    return (
      <ul key={genre._id}>
        <li>
          <img src={genre.coverImage} alt={genre.genre} />
          {genre.genre}
          {genre.description}
        </li>
      </ul>
    );
  });

  return { genreList };
}
