
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../../assets/css/style.css"
import {PostPageCardContainer} from "./PostPageCardContainer"
export function BlogPage(props) {

  return (
    <div >
    <div class="buffer-space"></div>

    <section className="virtuaL_wrapper section blogslistmain">
      <div className="container">
        <div className="heading">
          <div className="title typewriter">Our <span style={{display:'inline'}} data-text="Blogs">Blogs</span></div>
        </div>
      </div>
    </section>


      <section className="blogslist bauen-blog2">

      <PostPageCardContainer {...props} />




        </section>


    </div>
  );
}

export default BlogPage;
