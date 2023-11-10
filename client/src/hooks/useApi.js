import React, { useState } from "react";
import axios from "axios";
import ServerURL from "../variables/URLs";

//By default, this hook will use GET

axios.defaults.withCredentials = true;

export default function useApi({
  url,
  options = {},
  method = "GET",
  body = null,
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  async function request(optionalData) {
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
      } else {
        const error = new Error(response.data);
        setData(error);
      }
      setLoading(false);
    } catch (err) {
      setData(err);
    }
  }

  return { data, request, loading };
}
