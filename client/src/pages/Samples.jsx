import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import SamplesContainer from "../components/SamplesContainer";
import useApi from "../hooks/useApi";

export default function Samples() {
  const [sort, setSort] = useState("date");
  const [filterKey, setFilterKey] = useState("none");
  const [filterValue, setFilterValue] = useState("");
  const [fromSlider, setFromSlider] = useState(60);
  const [toSlider, setToSlider] = useState(200);

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

  const defaultFilterValues = {
    genre: genres && genres[0].genre,
    key: "A",
    bpm: "60-200",
    none: "",
  };

  useEffect(() => {
    setFilterValue(defaultFilterValues[filterKey]);
  }, [filterKey]);

  if (loading) return <p>Loading...</p>;

  const genreOptions = genres.map((genre) => {
    return (
      <option key={genre} value={genre.genre}>
        {genre.genre}
      </option>
    );
  });

  const keyOptions = ["A", "B", "C", "D", "E", "F", "G"].map((key) => {
    return (
      <option key={key} value={key}>
        {key}
      </option>
    );
  });

  function updateRange(e) {
    if (e.target.id === "fromSlider") {
      setFromSlider(e.target.value);
    }
    if (e.target.id === "toSlider") {
      setToSlider(e.target.value);
    }

    setFilterValue(`${fromSlider}-${toSlider}`);
  }

  const bpmOptions = (
    <div className="sliders-control">
      <label htmlFor="fromSlider">From</label>
      <p>{fromSlider} BPM</p>
      <input
        id="fromSlider"
        type="range"
        value={fromSlider}
        min="60"
        max="200"
        onChange={(e) => updateRange(e)}
      />
      <label htmlFor="toSlider">To</label>
      <p>{toSlider} BPM</p>
      <input
        id="toSlider"
        type="range"
        value={toSlider}
        min="60"
        max="200"
        onChange={(e) => updateRange(e)}
      />
    </div>
  );

  return (
    <Container>
      <h2>Samples</h2>
      <div className="filters flex flex-row items-center justify-center gap-5">
        <div className="sort">
          <label htmlFor="sort">Sort by</label>
          <select
            name="sort"
            id="sort"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="likes">Likes</option>
            <option value="views">Views</option>
          </select>
        </div>
        <div className="filter">
          <label htmlFor="filter">Filter by</label>
          <select
            name="filter"
            id="filter"
            onChange={(e) => setFilterKey(e.target.value)}
          >
            <option value="none">None</option>
            <option value="genre">Genre</option>
            <option value="key">Key</option>
            <option value="bpm">BPM</option>
          </select>

          {filterKey === "genre" && (
            <select
              name="genre"
              onChange={(e) => setFilterValue(e.target.value)}
            >
              {genreOptions}
            </select>
          )}
          {filterKey === "key" && (
            <select onChange={(e) => setFilterValue(e.target.value)}>
              {keyOptions}
            </select>
          )}
          {filterKey === "bpm" && bpmOptions}
        </div>
      </div>
      <SamplesContainer
        sort={sort}
        filterValue={filterValue}
        filterKey={filterKey}
      />
    </Container>
  );
}
