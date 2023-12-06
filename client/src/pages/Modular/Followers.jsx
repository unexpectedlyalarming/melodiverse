import React, { useEffect } from "react";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";
export default function Followers() {
  const { id } = useParams();

  const {
    data: followers,
    loading,
    request,
  } = useApi({
    url: `/followers/${id}`,
  });

  useEffect(() => {
    request();
  }, []);
  if (loading) return <p>Loading...</p>;

  const followersList =
    followers.length > 0 ? (
      followers.map((follower) => {
        return (
          <li className="follower" key={follower._id}>
            <img
              src={follower.avatar ? follower.avatar : "/img/avatar.png"}
              alt={follower.username}
            />
            <p>{follower.username}</p>
          </li>
        );
      })
    ) : (
      <p>No followers</p>
    );

  return (
    <div className="container">
      <h2>Followers</h2>
      <ul className="followers-list">{followersList}</ul>
    </div>
  );
}
