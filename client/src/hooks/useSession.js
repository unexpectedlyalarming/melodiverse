import React, { useEffect, useState } from "react";
import ServerURL from "../variables/URLs";
import UserContext from "../contexts/UserContext";
import axios from "axios";
export default function useSession() {
  const [user, setUser] = useState(UserContext.user || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const data = await axios.get(ServerURL + "/validate-session", {
          withCredentials: true,
        });

        if (data instanceof Error) {
          UserContext.setUser(null);
          setLoading(false);
        }
        if (data) {
          UserContext.setUser(data);
          setLoading(false);
        } else {
          UserContext.setUser(null);
          setLoading(false);
        }
      } catch (err) {
        UserContext.setUser(null);
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  return { user, setUser, loading };
}
