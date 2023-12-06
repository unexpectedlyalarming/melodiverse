import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";

export default function Following() {
  const { id } = useParams();

  const {
    data: following,
    loading,
    request,
  } = useApi({
    url: `/followers/following/${id}`,
  });

  useEffect(() => {
    request();
  }, []);
  if (loading) return <p>Loading...</p>;

  const followingList =
    following.length > 0 ? (
      following.map((following) => {
        return (
          <li className="following" key={following._id}>
            <img
              src={following.avatar ? following.avatar : "/img/avatar.png"}
              alt={following.username}
            />
            <p>{following.username}</p>
          </li>
        );
      })
    ) : (
      <p>Not following any users</p>
    );

  return (
    <div className="container">
      <h2>Following</h2>
      <ul className="following-list">{followingList}</ul>
    </div>
  );
}
