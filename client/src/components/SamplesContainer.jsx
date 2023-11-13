import React, { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import useApi from "../hooks/useApi";

export default function SamplesContainer({ sort }) {
  const sortMethod = `sort/${sort}`;
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
    <ul className="p-2 overflow-x-hidden text-white flex flex-row gap-5 justify-center items-center">
      {sampleList}
    </ul>
  );
}
