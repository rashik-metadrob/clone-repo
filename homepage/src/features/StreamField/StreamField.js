import React from "react";
import { ThumbnailGallery } from "./ThumbnailGallery";
import { ImageText } from "./ImageText";
import { ImageCarousel } from "./ImageCarousel";



function StreamField(props) {
  const streamField = props.value;
  let html = [];
  for (let i = 0; i < streamField.length; i++) {
    const field = streamField[i];

    if (field.type === "h1") {
      html.push(
        <div className="prose lg:prose-lg xl:prose-xl dark:prose-dark">
          <div style={{marginLeft:"20%",marginRight:"20%",marginBottom:"45px",textAlign:"left"}}  key={`${i}.${field.type}`}>
            <h1>{field.value}</h1>
          </div>
        </div>
      );
    } else if (field.type === "h2") {
      html.push(
        <div className="prose lg:prose-lg xl:prose-xl dark:prose-dark">
          <div style={{marginLeft:"20%",marginRight:"20%",marginBottom:"45px",textAlign:"left"}}  key={`${i}.${field.type}`}>
            {" "}
            <h2>{field.value}</h2>{" "}
          </div>
        </div>
      );
    } else if (field.type === "paragraph") {
      html.push(
        <div className="">
          <div key={`${i}.${field.type}`}>
            <div style={{marginLeft:"20%",marginRight:"20%",marginBottom:"45px",textAlign:"left"}} dangerouslySetInnerHTML={{ __html:field.value}} />
          </div>
        </div>
      );
    } else if (field.type === "thumbnail_gallery") {
      html.push(
        <div className="prose lg:prose-lg xl:prose-xl dark:prose-dark">
          <ThumbnailGallery value={field.value} key={`${i}.${field.type}`} />
        </div>
      );
    } else if (field.type === "image_text") {
      html.push(
        <div style={{marginLeft:"20%",marginRight:"20%",marginBottom:"45px",textAlign:"left"}}  className="prose lg:prose-lg xl:prose-xl dark:prose-dark">
          <ImageText value={field.value} key={`${i}.${field.type}`} />
        </div>
      );
    } else if (field.type === "image_carousel") {
      html.push(
              <div style={{marginLeft:"20%",marginRight:"20%",marginBottom:"45px",textAlign:"left"}}  >

        <ImageCarousel value={field.value} key={`${i}.${field.type}`} />
              </div>

      );
    } else {
      // fallback empty div
      html.push(<div className={field.type} key={`${i}.${field.type}`} />);
    }
  }

  return html;
}

export { StreamField };
