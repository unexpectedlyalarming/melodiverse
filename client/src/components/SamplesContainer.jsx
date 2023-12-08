import React, { useEffect } from "react";
import AudioPlayer from "./AudioPlayer";
import useApi from "../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ServerURL from "../variables/URLs";
import { useDebounce } from "use-debounce";

export default function SamplesContainer({
  sort,
  filterKey = "none",
  filterValue,
  limit,
  page,
}) {
  const [debouncedFilterValue] = useDebounce(filterValue, 200);
  const [debouncedSort] = useDebounce(sort, 200);

  const sortMethod = `sort/${sort}/`;

  // const { request: getSamples, loading } = useApi({
  //   url: "/samples/" + sortMethod,
  // });

  async function fetchSamples() {
    try {
      let url = ServerURL + "/samples/";

      if (filterKey === "none") {
        url += sortMethod + page + "/" + limit;
      } else if (["genre", "key", "bpm"].includes(filterKey)) {
        url +=
          filterKey + "/" + filterValue + "/" + sort + "/" + page + "/" + limit;
      }

      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    refetch();
  }, [debouncedFilterValue, debouncedSort, filterKey, limit, page]);

  // useEffect(() => {
  //   getSamples();
  // }, []);

  const {
    data: samples,
    status,
    refetch,
  } = useQuery({
    queryKey: [
      "samples",
      filterKey,
      debouncedFilterValue,
      debouncedSort,
      limit,
      page,
    ],
    queryFn: fetchSamples,
  });

  if (status === "loading") return <div>Loading...</div>;

  const sampleList =
    samples &&
    samples.map((sample) => {
      return <AudioPlayer sample={sample} key={sample._id} />;
    });
  return <ul className="sample-list">{sampleList}</ul>;
}
