import React, { useEffect } from "react";
import useApi from "../hooks/useApi";

export default function Inbox() {
  const {
    data: alerts,
    error,
    loading,
    request: getAlerts,
  } = useApi({
    url: "/alerts",
  });

  useEffect(() => {
    getAlerts();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error fetching data</div>;

  const alertList =
    alerts &&
    alerts.map((alert) => {
      return (
        <li key={alert._id}>
          <time>Sent on {alert.date.split("T", 1)}</time>
          <p>{alert.content}</p>
        </li>
      );
    });

  return (
    <div className="p-5 flex flex-col items-center text-white w-full">
      <h2>Alerts</h2>
      <ul className="p-2 overflow-x-hidden text-white flex flex-row gap-5 justify-center items-center">
        {alertList}
      </ul>
    </div>
  );
}
