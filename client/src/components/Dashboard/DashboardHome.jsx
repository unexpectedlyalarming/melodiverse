import React from "react";

export default function DashboardHome() {
  return (
    <div className="p-5 flex flex-col items-center text-white w-full">
      <h2 className="text-2xl">Dashboard</h2>
      <p className="text-gray-300">
        Welcome to the Mod Dashboard. Here you can manage genres, users, groups,
        and issues.
      </p>
      <p className="text-gray-300">
        Don't know what to do? Try clicking on one of the links on the left.
      </p>
    </div>
  );
}
