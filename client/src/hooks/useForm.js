import React, { useState } from "react";
import useApi from "./useApi";

export default async function useForm(values, url) {
  const [formValues, setFormValues] = useState(values);

  const [data, request] = useApi({
    url,
    method: "POST",
    body: formValues,
  });

  function handleChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      await request();

      if (data instanceof Error) {
        return new Error(data);
      }
      if (await data) {
        return data;
      }
    } catch (err) {
      return new Error(err);
    }
  }

  return { handleChange, handleSubmit, formValues };
}
