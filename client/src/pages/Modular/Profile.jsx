import React, { useEffect, useContext } from "react";
import Container from "../../components/Container";
import { Link, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { UserContext } from "../../contexts/UserContext";
import "../../css/profile.css";
export default function Profile() {
  const { id } = useParams();

  const { user } = useContext(UserContext);

  const { data: profile, request: getProfile } = useApi({
    url: `/users/${id}`,
  });

  const { data: following, request: getFollowing } = useApi({
    url: `/followers/check/${id}`,
  });

  useEffect(() => {
    getProfile();
  }, [following]);

  useEffect(() => {
    getProfile();
  }, []);

  const { data: follower, request: follow } = useApi({
    url: `/followers/${id}`,
    method: "post",
  });

  useEffect(() => {
    getFollowing();
  }, [follower]);

  async function handleFollow(e) {
    e.preventDefault();
    try {
      await follow();
      console.log(follower);
    } catch (err) {
      console.error(err);
    }
  }

  const othersProfile = (
    <div className="profile-interact">
      <button
        className="bg-primary-500 text-white rounded-md p-2"
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
      <button className="bg-primary-500 text-white rounded-md p-2">
        Message
      </button>
    </div>
  );

  const ownProfile = (
    <div className="profile-edit">
      <Link
        to={`/profile/edit/${user?._id}`}
        className="bg-primary-500 text-white rounded-md p-2"
      >
        Edit Profile
      </Link>
    </div>
  );

  return (
    <Container>
      <div className="profile-container">
        <img
          alt={profile?.username}
          src={profile?.avatar ? profile.avatar : "/img/avatar.png"}
        />
        <p>{profile?.username}</p>
        <p>{profile?.bio}</p>
        <div className="profile-follower">
          <button>{profile?.followers} Followers</button>
          <button>{profile?.following} Following</button>
        </div>
        {user?._id !== profile?._id && othersProfile}
        {user?._id === profile?._id && ownProfile}
      </div>
    </Container>
  );
}
