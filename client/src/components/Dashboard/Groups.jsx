import React from "react";
import GroupsContainer from "../GroupsContainer";
import CreateGroup from "../CreateGroup";

export default function DashboardGroups() {
  return (
    <div className="flex flex-col  items-center p-5 gap-5 w-full ">
      <h2>Groups</h2>
      <CreateGroup />
      <GroupsContainer />
    </div>
  );
}
