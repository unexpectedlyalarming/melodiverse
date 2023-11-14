import React, { useEffect } from "react";
import Container from "../../components/Container";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";

export default function Profile() {
  const { id } = useParams();

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

  return (
    <Container>
      <h2>Profile</h2>
      <p>Coming soon</p>
      <div className="flex flex-col gap-5 justify-center items-center">
        <img
          alt={profile?.username}
          src={profile?.avatar.length > 0 ? profile.avatar : "/img/avatar.png"}
          className="object-contain w-40 h-40 rounded-full"
        />
        <p>{profile?.username}</p>
        <div className="flex flex-row gap-5 justify-center items-center">
          <button>{profile?.followers.length} Followers</button>
          <button>{profile?.following.length} Following</button>
        </div>
        {
          //id !== profile?._id &&
          othersProfile
        }
      </div>
    </Container>
  );
}
