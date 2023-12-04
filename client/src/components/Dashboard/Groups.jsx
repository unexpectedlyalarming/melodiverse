import React from "react";
import GroupsContainer from "../GroupsContainer";
import CreateGroup from "../CreateGroup";

export default function DashboardGroups() {
  return (
    <div className="container ">
      <h2>Groups</h2>
      <CreateGroup />
      <GroupsContainer />
    </div>
  );
}
