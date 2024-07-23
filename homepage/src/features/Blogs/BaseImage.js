import React from "react";

const API_BASE = "https://www.metadrob.com"
// const API_BASE = "http://localhost:8000"

function BaseImage({ img, className = "" }) {
  console.log(`${API_BASE}${img.url}`,"BASE IS")
  return (
    <React.Fragment>
      {/* eslint-disable-next-line */}
      <img
        className={`${className}`}
        alt={img.alt}
        height={img.height}
        width={img.width}
        src={`${API_BASE}${img.url}`}
      />
    </React.Fragment>
  );
}

export { BaseImage };
