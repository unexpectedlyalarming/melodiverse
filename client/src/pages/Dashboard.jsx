import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  const sidebar = (
    <div className="bg-stone-900 text-white h-screen w-64 px-4 py-8">
      <ul className="flex flex-col gap-2">
        <li className="text-gray-400">
          <Link to="/">Back to melodiverse</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard Home</Link>
        </li>
        <li>
          <Link to="/dashboard/genres">Genres</Link>
        </li>
        <li>
          <Link to="/dashboard/users">Users</Link>
        </li>
        <li>
          <Link to="/dashboard/groups">Groups</Link>
        </li>
        <li>
          <Link to="/dashboard/issues">Issues</Link>
        </li>
        <li>
          <Link to="/dashboard/alerts">Alerts</Link>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      <div className="flex flex-row gap-2">
        {sidebar}
        <Outlet />
      </div>
    </>
  );
}
