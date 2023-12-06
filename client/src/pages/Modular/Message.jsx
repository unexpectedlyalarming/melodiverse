import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ServerURL from "../../variables/URLs";

export default function Message() {
  const navigate = useNavigate();

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
        setSuccess(true);
        setTimeout(() => {
          navigate(`/profile/${id}`);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <form onSubmit={submitMessage}>
        <label htmlFor="message">Message</label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="10"
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
