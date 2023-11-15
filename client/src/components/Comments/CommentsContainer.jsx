import React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ServerURL from "../../variables/URLs";
import { useParams } from "react-router";
import Comment from "./Comment";
import CreateComment from "./CreateComment";

export default function CommentsContainer() {
  const { id } = useParams();
  const queryClient = useQueryClient();

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

  // Don't know why, but tanstack v5 has some problem with mutations I couldn't figure out
  // It shouldn't hurt to do it manually though
  //   const { mutate: mutateComment } = useMutation(
  //     async (comment) => {
  //       const res = await axios.post(ServerURL + "/comments", comment, {
  //         withCredentials: true,
  //       });
  //       return res.data;
  //     },
  //     {
  //       onSuccess: (comment) => {
  //         queryClient.setQueryData(["comments"], (old) => [...old, comment]);
  //       },
  //       onError: (error, comment, rollback) => {
  //         console.error(error);
  //         rollback();
  //       },
  //     }
  //   );

  async function handleCreation(comment) {
    try {
      const res = await axios.post(ServerURL + "/comments", comment, {
        withCredentials: true,
      });
      if (res.data) {
        queryClient.setQueryData(["comments"], (old) => [...old, comment]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (status === "loading" || status === "pending")
    return <div>Loading...</div>;

  if (error) return <div>Error fetching data</div>;

  const commentsList = comments.map((comment) => {
    return <Comment key={comment._id} comment={comment} />;
  });

  return (
    <div className="comments">
      <CreateComment handleCreation={handleCreation} />
      {commentsList}
    </div>
  );
}
