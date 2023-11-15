import React, { useState } from "react";
import useApi from "../../hooks/useApi";

export default function DashboardAlerts() {
  const [alert, setAlert] = useState("");
  const { request: sendAlert } = useApi({
    url: "/alerts",
    method: "post",
    body: {
      content: alert,
    },
  });

  return (
    <div className="p-5 flex flex-col items-center text-white w-full">
      <h2>Alerts</h2>
      <form
        className="flex flex-col items-center justify-center w-full"
        onSubmit={(e) => {
          e.preventDefault();
          sendAlert();
        }}
      >
        <input
          className="p-2 m-2 w-1/2 text-black"
          type="text"
          placeholder="Alert"
          value={alert}
          onChange={(e) => setAlert(e.target.value)}
        />
        <button className="p-2 m-2 w-1/2 bg-red-600 text-white">
          Send Alert
        </button>
      </form>
    </div>
  );
}
