import React, { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Link } from "react-router-dom";

export default function Inbox() {
  const [inboxType, setInboxType] = useState("alerts");
  const {
    data: alerts,
    error,
    loading,
    request: getAlerts,
  } = useApi({
    url: "/alerts",
  });

  const {
    data: users,
    loading: usersLoading,
    request: getUsers,
  } = useApi({
    url: "/messages/users",
  });

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getAlerts();
  }, []);

  if (loading || usersLoading) return <div>Loading...</div>;

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

  const alertsView = (
    <>
      <h2>Alerts</h2>
      <ul className="inbox-list">{alertList}</ul>
    </>
  );

  const messagesList =
    users.length > 0 ? (
      users.map((user) => {
        return (
          <li key={user._id}>
            <Link to={`/message/user/${user._id}`}>{user.username}</Link>
          </li>
        );
      })
    ) : (
      <p>No messages.</p>
    );
  const messagesView = (
    <>
      <h2>Messages</h2>
      <ul className="inbox-list">{messagesList}</ul>
    </>
  );

  return (
    <div className="container inbox-container">
      <div className="inbox-type">
        <button
          onClick={() => {
            setInboxType("alerts");
          }}
          className=""
        >
          Alerts
        </button>
        <button
          onClick={() => {
            setInboxType("messages");
          }}
          className=""
        >
          Messages
        </button>
      </div>
      {inboxType === "alerts" ? alertsView : messagesView}
    </div>
  );
}
