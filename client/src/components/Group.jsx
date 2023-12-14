import React from "react";
import { Link } from "react-router-dom";

export default function Group({ group }) {
  return (
    <Link to={`/group/${group._id}`}>
      <img
        className="group-logo object-contain w-40 h-40 rounded-md"
        src={group.logo}
        alt={`${group.groupName} logo`}
      />
      <p className="group-name">{group.groupName}</p>
      <p className="group-description">{group.groupDescription}</p>
      <p className="group-members">
        {group.members.length > 0 ? group.members.length : 0} Members
      </p>
    </Link>
  );
}
