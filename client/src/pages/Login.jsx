import React, { useEffect, useState, useContext } from "react";
import Container from "../components/Container";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
export default function Login() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, success, error } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    await login(username, password);
  }

  useEffect(() => {
    if (success && user) {
      console.log(user);
      navigate("/", { replace: true });
    }
  }, [success, navigate, user]);

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
      <button onClick={() => navigate("/", { replace: true })}>
        Test Login
      </button>{" "}
    </Container>
  );
}
