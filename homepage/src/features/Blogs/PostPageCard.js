import React from "react";
import { BaseImage } from "./BaseImage";

export function PostPageCard(props) {
  const {post} = props;
  const {pageContent} = post;
  const dateStr = new Date(pageContent.firstPublishedAt);

const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (
    <div  className="row mb-5 pb-5 section--reveal" id="myBlock" onClick={() => window.location.href = '/blogs' + pageContent.url}>
      <div className="col-md-6 order2 valign animate-box fadeInLeft animated" data-animate-effect="fadeInLeft">
        <div className="content">
          <div className="date">
            <h3>{dateStr.getDate()}</h3>
            <h6>{month[dateStr.getMonth()]}  {dateStr.getFullYear()}</h6>
          </div>
          <div className="cont">
            <h4 className="title" style={{textAlign:'left'}}>{pageContent.title}</h4>


            </div>
        </div>
      </div>
     <a className="BaseImage" href={'/blogs'+pageContent.url}>
        <BaseImage  img={pageContent.headerImage} /></a>

    </div>
  );
}

export default PostPageCard ;
