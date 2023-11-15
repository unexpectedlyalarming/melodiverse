import React from "react";
import Container from "../components/Container";
import CreateGroup from "../components/CreateGroup";
import GroupsContainer from "../components/GroupsContainer";

export default function Groups() {
  return (
    <Container>
      <h2>Groups</h2>
      <CreateGroup />
      <GroupsContainer />
    </Container>
  );
}
