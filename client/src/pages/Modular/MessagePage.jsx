import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";
import Message from "./Message";
import axios from "axios";
import ServerURL from "../../variables/URLs";

export default function MessagePage() {
  const { id } = useParams();

  const [message, setMessage] = useState("");

  const [success, setSuccess] = useState(false);

  async function submitMessage(e) {
    try {
      e.preventDefault();
      const res = await axios.post(ServerURL + "/messages", {
        message,
        receiver: id,
      });

      if (res.status === 200) {
        setSuccess(!success);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const {
    data: messages,
    loading,
    request,
  } = useApi({
    url: `/messages/user/${id}`,
  });

  useEffect(() => {
    request();
  }, [success]);

  if (loading) return <p>Loading...</p>;

  const messageList = messages.map((message) => (
    <li key={message.id}>
      <h3>{message.username}</h3>
      <time>Sent on {message.date.split("T", 1)}</time>
      <p to={`/message/${message.id}`}>{message.content}</p>
    </li>
  ));

  return (
    <div className="container">
      <h1>Message Page</h1>
      <ul>{messageList}</ul>
      <div className="container">
        <form onSubmit={submitMessage}>
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            cols="30"
            rows="5"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
