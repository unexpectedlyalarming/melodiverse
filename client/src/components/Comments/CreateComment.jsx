import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router";

export default function CreateComment() {
  const [comment, setComment] = useState("");
  const { id } = useParams();

  const { request } = useApi({
    method: "post",
    url: "/comments/",
    body: {
      comment,
      itemId: id,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        request();
      }}
    >
      <label htmlFor="comment">Comment</label>
      <input
        type="text"
        name="comment"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
