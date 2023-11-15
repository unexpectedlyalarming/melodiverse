import React, { useContext, useEffect, useState } from "react";
import ServerURL from "../variables/URLs";
import UserContext from "../contexts/UserContext";
import axios from "axios";
export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await axios.get(ServerURL + "/auth/validate-session", {
          withCredentials: true,
        });

        if (response instanceof Error) {
          setUser(null);
        }
        if (response.data) {
          setUser(response.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [setUser]);

  return { user, setUser, loading };
}
