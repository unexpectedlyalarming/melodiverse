import React, { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import useApi from "../hooks/useApi";

export default function SamplesContainer() {
  const sortMethod = "/sort/date";
  const {
    data: samples,
    request: getSamples,
    loading,
  } = useApi({
    url: "/samples/" + sortMethod,
  });

  useEffect(() => {
    getSamples();
  }, []);

  if (loading) return <div>Loading...</div>;

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
    <ul className="bg-black text-white flex flex-col justify-center items-center">
      {sampleList}
    </ul>
  );
}
