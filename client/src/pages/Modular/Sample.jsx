import React, { useEffect } from "react";
import AudioPlayer from "../../components/AudioPlayer";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import axios from "axios";

import ServerURL from "../../variables/URLs";
import CommentsContainer from "../../components/Comments/CommentsContainer";
export default function Sample() {
  const { id } = useParams();

  const { data: sample, status } = useQuery({
    queryKey: ["sample", id],
    queryFn: () =>
      axios.get(ServerURL + "/samples/" + id).then((res) => res.data),
    refetchInterval: 100000,
  });

  if (status === "loading" || status === "pending")
    return <div>Loading...</div>;

  if (status === "error") return <div>Error fetching data</div>;

  return (
    <div className="sample">
      <AudioPlayer sample={sample} />
      <p className="sample-description">{sample?.description}</p>
      <div className="sample-info">
        <p className="sample-genre">{sample?.genre}</p>
        <p className="sample-key">{sample?.key}</p>
        <p className="sample-bpm">{sample?.bpm} BPM</p>
      </div>
      <div className="sample-tags">
        <p className="sample-tag">{sample?.tag}</p>
      </div>
      <CommentsContainer />
    </div>
  );
}
