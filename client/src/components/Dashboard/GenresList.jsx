import React, { useEffect } from "react";
import useApi from "../../hooks/useApi";

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
      <li
        key={genre._id}
        className="flex flex-col justify-center items-center gap-5"
      >
        <img
          src={genre.coverImage ? genre.coverImage : "./img/avatar.png"}
          alt={genre.genre}
          className="object-contain w-40 h-40 rounded-md"
        />
        <p>{genre.genre}</p>
        <p>{genre.description}</p>
      </li>
    );
  });

  if (genreList.length > 0)
    return (
      <ul className="flex flex-row gap-5 items-center justify-center w-full">
        {genreList}
      </ul>
    );

  return <div>No genres found</div>;
}
