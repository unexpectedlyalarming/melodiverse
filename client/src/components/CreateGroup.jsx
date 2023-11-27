import React, { useEffect, useState } from "react";

import useApi from "../hooks/useApi";

export default function CreateGroup() {
  const [hidden, setHidden] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [file, setFile] = useState("");

  const { data: group, request: createGroup } = useApi({
    url: "/groups",
    method: "post",
    body: {
      groupName,
      groupDescription,
      logo: file,
    },
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  if (hidden) {
    return (
      <>
        <button onClick={() => setHidden(!hidden)}>Create Group</button>
      </>
    );
  }

  return (
    <>
      <button onClick={() => setHidden(!hidden)}>Close</button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createGroup();
        }}
        className="flex flex-col p-2 gap-5 justify-center items-center"
      >
        <h1 className="text-3xl font-bold">Create Group</h1>
        <label htmlFor="title">Group Name</label>
        <input
          type="text"
          name="title"
          id="title"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <label htmlFor="description">Group Description</label>
        <input
          type="text"
          name="description"
          id="description"
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
        />
        <label htmlFor="logo">Logo</label>
        <input
          type="file"
          name="logo"
          id="logo"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
