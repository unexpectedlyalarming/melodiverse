import React, { useContext, useState } from "react";
import axios from "axios";
import ServerURL from "../variables/URLs";
import UserContext from "../contexts/UserContext";
import { set } from "mongoose";

export default function useAuth() {
  const { setUser } = useContext(UserContext);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        ServerURL + "/auth/log-in",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      if (response.data) {
        setUser(response.data);
        setSuccess(true);
      } else {
        setError(response.data.message);
        throw new Error("Login failed");
      }
    } catch (err) {
      setError(err.response.data.message);
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(ServerURL + "/auth/log-out");
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return { login, logout, success, error };
}
