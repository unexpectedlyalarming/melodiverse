import React, { useState } from "react";
import axios from "axios";
import ServerURL from "../variables/URLs";

export default function useAuth(userContext) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await axios.post(ServerURL + "/log-in", {
        username,
        password,
      });
      if (response.data) {
        setUser(response.data);
        userContext.setUser(response.data);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      console.error(err);
    }

    const logout = async () => {
      try {
        await axios.post(ServerURL + "/log-out");
        setUser(null);
        userContext.setUser(null);
      } catch (err) {
        console.error(err);
      }
    };

    return { user, login, logout };
  };
}
