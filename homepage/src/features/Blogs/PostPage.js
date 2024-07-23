import React from "react";
import { PostDetail } from "./PostDetails";
import "../../assets/css/style.css"

function PostPage(props) {
  return (
    <div className="flex flex-col min-h-screen">

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-row flex-wrap py-4" style={{marginTop:"100px"}}>
          <PostDetail {...props} />

        </div>
      </div>

    </div>
  );
}

export default PostPage;
