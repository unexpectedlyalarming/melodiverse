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
      </div>
    </Container>
  );
}
