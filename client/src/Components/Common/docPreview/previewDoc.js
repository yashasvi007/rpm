import React from "react";

export default ({ type, className, ...props }) => {
  if (type.startsWith("image")) {
    return <img {...props} alt="" className={className} />;
  } else if (type.startsWith("video")) {
    return (
      <video
        controls
        className={`${className} object-fill`}
        preload="auto"
        {...props}
      />
    );
  } else {
    return (
      <div
        className={`${className} white fontsize22 medium other-docs flex align-items-center justify-content-center`}
      >
        PDF
      </div>
    );
  }
};
