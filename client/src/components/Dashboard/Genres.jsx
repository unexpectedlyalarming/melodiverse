import React from "react";
import GenresList from "./GenresList";
import CreateGenre from "./CreateGenre";

export default function DashboardGenres() {
  return (
    <div className="container">
      <h2 className="text-2xl">Add a Genre</h2>
      <CreateGenre />
      <h2 className="text-2xl">Genres</h2>

      <GenresList />
    </div>
  );
}
