import React, { useState } from "react";
import axios from "axios";
import ServerURL from "../variables/URLs";
import UserContext from "../contexts/UserContext";

export default function useAuth() {
  const [user, setUser] = useState(UserContext.user || null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(ServerURL + "/auth/log-in", {
        username,
        password,
      });
      if (response.data) {
        setUser(response.data);
        UserContext.setUser(response.data);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await axios.post(ServerURL + "/auth/log-out");
      setUser(null);
      UserContext.setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return { user, login, logout };
}
