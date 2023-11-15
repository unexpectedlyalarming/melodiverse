import React from "react";
import { Link } from "react-router-dom";

export default function Comment({ comment }) {
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
    </div>
  );
}
