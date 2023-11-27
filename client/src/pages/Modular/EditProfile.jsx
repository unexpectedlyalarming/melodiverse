import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { useParams } from "react-router-dom";
import Container from "../../components/Container";

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState("");
  const [bio, setBio] = useState("");

  const {
    data: user,
    request: getUser,
    loading,
  } = useApi({
    url: `/users/${id}`,
    method: "get",
  });

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setBio(user.bio);
    }
  }, [user]);

  const {
    request: editUser,
    data: newUser,
    success,
  } = useApi({
    url: `/users/${id}`,
    method: "patch",

    body: {
      bio,
      avatar,
    },
    options: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  });

  useEffect(() => {
    if (success) {
      navigate(`/profile/${id}`);
    }
  }, [newUser]);

  if (loading) return <p>Loading...</p>;

  return (
    <Container>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editUser();
        }}
      >
        <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
        <label htmlFor="avatar">Avatar</label>
        <input
          type="file"
          id="avatar"
          value={avatar}
          onChange={(e) => setAvatar(e.target.files[0])}
        />

        <label htmlFor="bio">Bio</label>
        <input
          type="text"
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </Container>
  );

  //   avatar: {
  //     type: String,
  //     default: "",
  //   },
  //   bio: {
  //     type: String,
  //     max: 100,
  //   },
}
