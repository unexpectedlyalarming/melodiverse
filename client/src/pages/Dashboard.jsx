import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../css/dashboard.css";

export default function Dashboard() {
  const sidebar = (
    <ul className="dashboard-sidebar">
      <li>
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
  );

  return (
    <>
      <div className="dashboard-container">
        {sidebar}
        <Outlet />
      </div>
    </>
  );
}
