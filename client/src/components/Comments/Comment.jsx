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
    <div className="comment-options">
      <button onClick={handleDelete} className="text-gray-300 text-sm">
        Delete
      </button>
      <button onClick={handleEdit} className="text-gray-300 text-sm">
        Edit
      </button>
    </div>
  );

  return (
    <div className="comment">
      <div className="comment-content">
        <p className="text-gray-300 text-sm">{comment.comment}</p>
      </div>
      <div className="comment-user">
        <Link
          to={`/profile/${comment.userId}`}
          className="text-gray-300 text-sm"
        >
          {comment.username}
        </Link>
      </div>
      {user._id === comment.userId ? ownerOptions : null}
    </div>
  );
}
