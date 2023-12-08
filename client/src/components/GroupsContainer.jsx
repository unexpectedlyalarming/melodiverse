import React, { useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ServerURL from "../variables/URLs";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

export default function GroupsContainer() {
  const { user } = useContext(UserContext);

  const { data: groups, status } = useQuery({
    queryKey: ["groups"],
    queryFn: () =>
      axios
        .get(ServerURL + "/groups", { withCredentials: true })
        .then((res) => res.data),
    refetchInterval: 4000,
  });

  const queryClient = useQueryClient();

  if (status === "loading" || status === "pending")
    return <div>Loading...</div>;

  if (status === "error") return <div>Error fetching data</div>;

  const groupsList = groups.map((group) => {
    async function handleJoin() {
      try {
        if (group.members.includes(user._id)) {
          await axios.patch(ServerURL + "/groups/" + group._id + "/leave", {
            withCredentials: true,
          });
        } else {
          await axios.patch(ServerURL + "/groups/" + group._id + "/join", {
            withCredentials: true,
          });
        }
        //update the cache
        queryClient.invalidateQueries("groups");
      } catch (err) {
        console.error(err);
      }
    }
    return (
      <li className="group" key={group._id}>
        <img
          className="group-logo object-contain w-40 h-40 rounded-md"
          src={group.logo}
          alt={`${group.groupName} logo`}
        />
        <Link to={`/group/${group._id}`} className="group-name">
          {group.groupName}
        </Link>
        <p className="group-description">{group.groupDescription}</p>
        <p className="group-members">
          {group.members.length > 0 ? group.members.length : 0} Members
        </p>
        <p className="group-collections">{group.collections}</p>
        {group.members.includes(user._id) ? (
          <button onClick={handleJoin} className="group-join">
            Leave
          </button>
        ) : (
          <button onClick={handleJoin} className="group-leave">
            Join
          </button>
        )}
      </li>
    );
  });
  return (
    <div className="groups">
      <ul className="groups-list">{groupsList}</ul>
    </div>
  );
}
