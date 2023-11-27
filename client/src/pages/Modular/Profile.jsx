import React, { useEffect, useContext } from "react";
import Container from "../../components/Container";
import { Link, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { UserContext } from "../../contexts/UserContext";

export default function Profile() {
  const { id } = useParams();

  const { user } = useContext(UserContext);

  const { data: profile, request: getProfile } = useApi({
    url: `/users/${id}`,
  });

  useEffect(() => {
    getProfile();
  }, []);

  const { data: follower, request: follow } = useApi({
    url: `/followers/${id}`,
    method: "post",
  });

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
    <div className="flex flex-row gap-5 justify-center items-center">
      <button
        className="bg-primary-500 text-white rounded-md p-2"
        onClick={handleFollow}
      >
        {follower ? "Unfollow" : "Follow"}
      </button>
      <button className="bg-primary-500 text-white rounded-md p-2">
        Message
      </button>
    </div>
  );

  const ownProfile = (
    <div className="flex flex-row gap-5 justify-center items-center">
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
      <div className="flex flex-col gap-5 justify-center items-center">
        <img
          alt={profile?.username}
          src={profile?.avatar.length > 0 ? profile.avatar : "/img/avatar.png"}
          className="object-contain w-40 h-40 rounded-full"
        />
        <p>{profile?.username}</p>
        <p>{profile?.bio}</p>
        <div className="flex flex-row gap-5 justify-center items-center">
          <button>{profile?.followers.length} Followers</button>
          <button>{profile?.following.length} Following</button>
        </div>
        {user?._id !== profile?._id && othersProfile}
        {user?._id === profile?._id && ownProfile}
      </div>
    </Container>
  );
}
