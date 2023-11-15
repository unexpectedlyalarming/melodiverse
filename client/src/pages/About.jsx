import React from "react";
import Container from "../components/Container";
export default function About() {
  return (
    <Container>
      <h2 className="text-2xl p-2">About</h2>
      <p className="text-center p-2 text-lg">
        Melodiverse is a platform for musicians to share their music and
        collaborate with other musicians. <br />
        One of the primary features of melodiverse is the ability to share and
        browse user created royalty-free samples.
      </p>
    </Container>
  );
}
