import React from "react";
import Container from "../../components/Container";
import SamplesContainer from "../../components/SamplesContainer";

export default function Feed() {
  return (
    <Container>
      <div className="feed-header">
        <h2>Feed</h2>
        <div className="feed-search">
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <h2>Latest</h2>
      <div className="feed-sample">
        <SamplesContainer sort="date" />
      </div>

      <h2>Popular</h2>

      <div className="feed-sample flex flex-row items-center">
        <SamplesContainer sort="likes" />
      </div>

      <h2>Following</h2>

      <div className="feed-sample">
        <SamplesContainer sort="views" />
      </div>
    </Container>
  );
}
