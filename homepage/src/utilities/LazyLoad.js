import React from "react";
// import { BlogPage } from './features/Blogs/BlogPage';

export default {
  BlogPage: React.lazy(() => import("../features/Blogs/BlogPage")),
  PostPage: React.lazy(() => import("../features/Blogs/PostPage")),

};
