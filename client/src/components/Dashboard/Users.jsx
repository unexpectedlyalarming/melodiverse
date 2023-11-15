import React, { useEffect } from "react";
import useApi from "../../hooks/useApi";
import { Link } from "react-router-dom";

export default function DashboardUsers() {
  const {
    data: users,
    request: getUsers,
    loading,
  } = useApi({
    url: "/users",
  });

  useEffect(() => {
    getUsers();
  }, []);

  if (loading)
    return (
      <div className="p-5 flex flex-col items-center text-white w-full">
        Loading...
      </div>
    );

  const userList =
    users &&
    users.map((user) => {
      return (
        <li key={user._id}>
          <Link to={`/profile/${user._id}`}>{user.username}</Link>
        </li>
      );
    });

  return (
    <div className="p-5 flex flex-col items-center text-white w-full">
      <h2>Users</h2>
      <ul className="p-2 overflow-x-hidden text-white flex flex-row gap-5 justify-center items-center">
        {userList}
      </ul>
    </div>
  );
}
