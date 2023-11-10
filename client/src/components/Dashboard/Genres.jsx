import React from "react";
import GenresList from "./GenresList";
import CreateGenre from "./CreateGenre";

export default function DashboardGenres() {
  return (
    <div className="flex flex-col gap-2 justify-start items-start p-5">
      <h2 className="text-2xl">Add a Genre</h2>
      <CreateGenre />
      <h2 className="text-2xl">Genres</h2>

      <GenresList />
    </div>
  );
}
