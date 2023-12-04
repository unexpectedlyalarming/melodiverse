import React from "react";
import Container from "../../components/Container";
import SamplesContainer from "../../components/SamplesContainer";
import "../../css/feed.css";
import CreateSample from "../../components/CreateSample";
export default function Feed() {
  return (
    <Container>
      <CreateSample />
      <div className="feed-header">
        <h2>Feed</h2>
        <div className="feed-search">
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div className="feed-sample">
        <h2>Latest</h2>
        <SamplesContainer sort="date" page="1" limit="10" />
      </div>

      <div className="feed-sample">
        <h2>Popular</h2>
        <SamplesContainer sort="likes" page="1" limit="10" />
      </div>

      <div className="feed-sample">
        <h2>Following</h2>
        <SamplesContainer sort="views" page="1" limit="10" />
      </div>
    </Container>
  );
}
