import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, success, error } = useAuth();

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      await login(username, password);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success]);

  return (
    <Container>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p>{error}</p> : null}
        <button>Login</button>
      </form>
      <Link to="/register">Register</Link>
    </Container>
  );
}
