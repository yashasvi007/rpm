import React from "react";
import DocDisplayer from "./previewDoc";
import remove from "../../../Assets/images/ico-doc-remove.svg";
import "./style.less";

export default function preview({ media, onRemove }) {
  const renderedImages = [];
  media.forEach((medium, index) => {
    if (medium.mediaType !== "WebLink") {
      renderedImages.push(
        <div className="mr12 mb24" key={index}>
          <img
            src={remove}
            alt=""
            onClick={() => onRemove(medium.index)}
            className="delete-attachment-badge clickable"
          />
          <div className="case-image-background">
            <DocDisplayer
              type={medium.mediaType}
              className="caseImage"
              src={medium.url}
            />
          </div>
        </div>
      );
    }
  });
  return <div className="mb5 mt10 flex flex-wrap">{renderedImages}</div>;
}
