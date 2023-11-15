import React, { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import useApi from "../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ServerURL from "../variables/URLs";

export default function SamplesContainer({ sort }) {
  const sortMethod = `sort/${sort}`;
  // const { request: getSamples, loading } = useApi({
  //   url: "/samples/" + sortMethod,
  // });

  async function fetchSamples() {
    try {
      const res = await axios.get(ServerURL + "/samples/" + sortMethod, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    refetch();
  }, [sort]);

  // useEffect(() => {
  //   getSamples();
  // }, []);

  const {
    data: samples,
    status,
    refetch,
  } = useQuery({
    queryKey: ["samples"],
    queryFn: fetchSamples,
  });

  if (status === "loading") return <div>Loading...</div>;

  const sampleList =
    samples &&
    samples.map((sample) => {
      return (
        <li key={sample._id}>
          <AudioPlayer sample={sample} />
        </li>
      );
    });
  return (
    <ul className="p-2 overflow-x-hidden text-white flex flex-row gap-5 justify-center items-center">
      {sampleList}
    </ul>
  );
}
