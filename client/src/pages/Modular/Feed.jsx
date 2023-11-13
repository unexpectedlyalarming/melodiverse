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
        <ul className="feed-sample-list flex flex-row items-center gap-5">
          <li className="feed-sample-item">
            <a>example</a>
          </li>

          <li className="feed-sample-item">
            <a>example</a>
          </li>
          <li className="feed-sample-item">
            <a>example</a>
          </li>
        </ul>
      </div>

      <h2>Following</h2>

      <div className="feed-sample">
        <ul className="feed-sample-list flex flex-row items-center gap-5">
          <li className="feed-sample-item">
            <a>example</a>
          </li>
          <li className="feed-sample-item">
            <a>example</a>
          </li>
          <li className="feed-sample-item">
            <a>example</a>
          </li>
        </ul>
      </div>
    </Container>
  );
}
