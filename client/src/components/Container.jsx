import React from "react";

export default function Container({ children }) {
  return (
    <div className="flex flex-col items-center justify-center py-2 text-white">
      {children}
    </div>
  );
}
