import React, { useState } from "react";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router";

export default function CreateComment({ handleCreation }) {
  const [comment, setComment] = useState("");
  const { id } = useParams();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        handleCreation({ comment, itemId: id });
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
