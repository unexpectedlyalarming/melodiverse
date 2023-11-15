import React, { useState } from "react";
import Container from "../components/Container";
import SamplesContainer from "../components/SamplesContainer";

export default function Samples() {
  const [sort, setSort] = useState("date");
  return (
    <Container>
      <h2>Samples</h2>
      <div className="filters flex flex-row items-center justify-center gap-5">
        <div className="filter">
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
      </div>
      <SamplesContainer sort={sort} />
    </Container>
  );
}
