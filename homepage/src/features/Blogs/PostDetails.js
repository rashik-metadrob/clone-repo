import React from "react";
import { StreamField } from "../StreamField/StreamField";
import "../../assets/css/style.css"
import { Helmet, HelmetProvider } from "react-helmet-async";

function PostDetail(props) {
  const {pageContent} = props;
  document.getElementsByTagName("META")[2].content=pageContent.searchDescription
  document.getElementsByTagName("META")[2].name=pageContent.seoTitle

  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">
    <Helmet>
       <meta name={pageContent.seoTitle} content={pageContent.searchDescription} />
     </Helmet>
      <div className="prose lg:prose-lg xl:prose-xl dark:prose-dark">
        <h1>{pageContent.title}</h1>
        <hr/>
        <div> </div>
      </div>

      <StreamField value={pageContent.body}/>

    </main>
  );
}

export { PostDetail };
