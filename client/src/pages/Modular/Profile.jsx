import React, { useEffect, useContext } from "react";
import Container from "../../components/Container";
import { Link, useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { UserContext } from "../../contexts/UserContext";
import "../../css/profile.css";
import Sample from "./Sample";
import AudioPlayer from "../../components/AudioPlayer";
import Groups from "../Groups";
import Group from "../../components/Group";
export default function Profile() {
  const { id } = useParams();

  const { user } = useContext(UserContext);

  const {
    data: profile,
    request: getProfile,
    loading,
  } = useApi({
    url: `/users/${id}`,
  });

  const { data: following, request: getFollowing } = useApi({
    url: `/followers/check/${id}`,
  });

  useEffect(() => {
    getProfile();
  }, [following, id]);

  useEffect(() => {
    getProfile();
  }, [id]);

  const { data: follower, request: follow } = useApi({
    url: `/followers/${id}`,
    method: "post",
  });

  useEffect(() => {
    getFollowing();
  }, [follower, id]);

  async function handleFollow(e) {
    e.preventDefault();
    try {
      await follow();
      console.log(follower);
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p>Loading...</p>;

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

  const samples =
    profile.samples.length > 0 ? (
      profile.samples.map((sample) => {
        return <AudioPlayer key={sample._id} sample={sample} />;
      })
    ) : (
      <p>No samples</p>
    );

  const groups =
    profile.groups.length > 0 ? (
      profile.groups.map((group) => {
        return <Group key={group._id} group={group} />;
      })
    ) : (
      <p>No groups</p>
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
          <Link to={`/profile/followers/${id}`}>
            {profile?.followers} Followers
          </Link>
          <Link to={`/profile/following/${id}`}>
            {profile?.following} Following
          </Link>
        </div>
        {user?._id !== profile?._id && othersProfile}
        {user?._id === profile?._id && ownProfile}

        <ul className="profile-samples">
          <h2>Samples</h2>
          {samples}
        </ul>
        <ul className="profile-groups">
          <h2>Groups</h2>
          {groups}
        </ul>
      </div>
    </Container>
  );
}
