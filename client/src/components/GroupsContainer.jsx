import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ServerURL from "../variables/URLs";

export default function GroupsContainer() {
  const {
    data: groups,
    status,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get(ServerURL + "/groups", { withCredentials: true })
        .then((res) => res.data),
    refetchInterval: 4000,
  });

  if (status === "loading" || status === "pending")
    return <div>Loading...</div>;

  if (status === "error") return <div>Error fetching data</div>;

  const groupsList = groups.map((group) => {
    return (
      <li className="group" key={group._id}>
        <p className="group-name">{group.groupName}</p>
        <p className="group-description">{group.groupDescription}</p>
        <p className="group-members">
          {group.members.length > 0 ? group.members : 0} Members
        </p>
        <p className="group-collections">{group.collections}</p>
      </li>
    );
  });
  return (
    <div className="groups">
      <ul className="groups-list">{groupsList}</ul>
    </div>
  );
}
