import AudioPlayer from "../components/AudioPlayer";
import Container from "../components/Container";
import React from "react";
import "../index.css";
import Feed from "./Modular/Feed";

export default function Home() {
  return (
    <>
      <Container>
        <Feed />
      </Container>
    </>
  );
}
