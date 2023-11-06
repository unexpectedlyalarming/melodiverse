import React, { useContext, useEffect, useState } from "react";
import ServerURL from "../variables/URLs";
import UserContext from "../contexts/UserContext";
import axios from "axios";
export default function useSession() {
  const [user, setUser] = useState(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await axios.get(ServerURL + "/auth/validate-session", {
          withCredentials: true,
        });

        if (data instanceof Error) {
          setUser(null);
          setLoading(false);
        }
        if (data) {
          setUser(data);
          setLoading(false);
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        setUser(null);
        setLoading(false);
      }
    }
    fetchSession();
  }, [setUser]);

  return { user, setUser, loading };
}
