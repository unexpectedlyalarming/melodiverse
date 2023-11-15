import React from "react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ServerURL from "../../variables/URLs";
import { useParams } from "react-router";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

export default function CommentsContainer() {
  const { id } = useParams();

  const {
    data: comments,
    status,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
      axios
        .get(ServerURL + "/comments/sample/" + id, { withCredentials: true })
        .then((res) => res.data),
    refetchInterval: 4000,
  });

  if (status === "loading" || status === "pending")
    return <div>Loading...</div>;

  if (error) return <div>Error fetching data</div>;

  const commentsList = comments.map((comment) => {
    return <Comment key={comment._id} comment={comment} />;
  });

  return (
    <div className="comments">
      <CreateComment />
      {commentsList}
    </div>
  );
}
