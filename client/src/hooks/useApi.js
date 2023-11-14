import React, { useState } from "react";
import axios from "axios";
import ServerURL from "../variables/URLs";

//By default, this hook will use GET

axios.defaults.withCredentials = true;

export default function useApi({
  url,
  options = {},
  method = "get",
  body = null,
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  async function request(optionalData = null) {
    try {
      const response = await axios[method](
        ServerURL + url,
        optionalData ? optionalData : body,
        {
          withCredentials: true,
          ...options,
        }
      );
      if (response.data) {
        setData(response.data);
      } else if (response.data === false) {
        setData(false);
      } else {
        const error = new Error(response.data);
        setData(error);
      }
      setLoading(false);
    } catch (err) {
      setData(err);
    }
  }

  return { data, setData, request, loading };
}
