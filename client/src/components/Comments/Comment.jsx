import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import useApi from "../../hooks/useApi";

export default function Comment({ comment, deleteProp }) {
  const { user } = useContext(UserContext);

  const { request: deleteComment, success: successfulDelete } = useApi({
    url: `/comments/${comment._id}`,
    method: "delete",
  });

  async function handleDelete() {
    try {
      await deleteComment();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (successfulDelete) {
      deleteProp(comment._id);
    }
  }, [successfulDelete]);

  const { request: editComment } = useApi({
    url: `/comments/${comment._id}`,
    method: "patch",
  });

  async function handleEdit() {
    await editComment();
  }

  const ownerOptions = (
    <div className="flex flex-row items-center justify-start w-full">
      <button onClick={handleDelete} className="text-gray-300 text-sm">
        Delete
      </button>
      <button onClick={handleEdit} className="text-gray-300 text-sm">
        Edit
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-start justify-start w-full p-5">
      <div className="flex flex-row items-center justify-start w-full">
        <div className="flex flex-col items-start justify-start w-full">
          <p className="text-gray-300 text-sm">{comment.comment}</p>
        </div>
      </div>
      <div className="flex flex-row items-center justify-start w-full">
        <div className="flex flex-col items-start justify-start w-full">
          <Link
            to={`/profile/${comment.userId}`}
            className="text-gray-300 text-sm"
          >
            {comment.username}
          </Link>
        </div>
      </div>
      {user._id === comment.userId ? ownerOptions : null}
    </div>
  );
}
