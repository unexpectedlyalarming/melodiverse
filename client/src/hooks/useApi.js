import React, { useState } from "react";
import axios from "axios";
import ServerURL from "../variables/URLs";

//By default, this hook will use GET

export default async function useApi({
  url,
  options = {},
  method = "GET",
  body = null,
}) {
  const [data, setData] = useState(null);

  const request = async () => {
    try {
      const response = await axios[method](
        ServerURL + url,
        body,
        { withCredentials: true },
        options
      );
      if (response.data) {
        setData(response.data);
      } else {
        const error = new Error(response.data);
        setData(error);
      }
    } catch (err) {
      setData(err);
    }
  };

  return { data, request };
}