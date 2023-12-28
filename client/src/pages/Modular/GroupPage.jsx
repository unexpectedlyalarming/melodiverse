import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../hooks/useApi";

export default function GroupPage() {
  const { id } = useParams();
  const {
    data: group,
    loading,
    request: fetchGroup,
  } = useApi({
    url: `/groups/${id}`,
  });

  useEffect(() => {
    fetchGroup();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{group.groupName}</h1>
      <p>{group.groupDescription}</p>

      <h2>Collections</h2>
      <ul>
        {group.collections.length > 0 ? (
          group.collections.map((collection) => (
            <li key={collection._id}>{collection.name}</li>
          ))
        ) : (
          <p>No collections</p>
        )}
      </ul>
    </div>
  );
}
