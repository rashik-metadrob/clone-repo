import React from "react";
import { useLocation, Link } from "react-router-dom";
import PostPageCard from "./PostPageCard"

 function getPageItems(props, location) {
  const { paginator } = props;
  const { currentPage } = paginator;
  let items = [];

  const curPath = location.pathname;

  let prePageUrl, nextPageUrl;
  if (curPath.match(/\/page-[0-9]+/)) {
    prePageUrl = curPath.replace(/\/page-[0-9]+/, `/page-${currentPage - 1}`);
    nextPageUrl = curPath.replace(/\/page-[0-9]+/, `/page-${currentPage + 1}`);
  } else {
    prePageUrl = `${curPath}/page-${currentPage - 1}`.replace("//", "/");
    nextPageUrl = `${curPath}/page-${currentPage + 1}`.replace("//", "/");
  }

  items.push(
    <li key={prePageUrl}>
      <Link
        to={prePageUrl}
        className="paginationButton"
      >
        Prev
      </Link>
    </li>
  );

  items.push(
    <li key={nextPageUrl}>
      <Link
        to={nextPageUrl}
        className="paginationButton"
      >
        Next
      </Link>
    </li>
  );

  return items;
}

function getFilterMsg(props) {
  const { filterMeta } = props;
  let filterMsg = "";
  if (filterMeta.filterType) {
    filterMsg = (
      <div
        className="px-4 py-3 leading-normal text-blue-700 bg-blue-100 rounded-lg mb-4"
        role="alert"
      >
        <p>
          {filterMeta.filterType}: {filterMeta.filterTerm}
        </p>
      </div>
    );
  }
  return filterMsg;
}

export function PostPageCardContainer(props) {
  const { childrenPages } = props;
  const location = useLocation();
  const pageItems = getPageItems(props, location);
  const filterMsg = getFilterMsg(props);

  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">
      {filterMsg}

      {childrenPages.map((post) => (

        <div className="wrapper">
          <div className="overlay"></div>
          <div className="content">
          <PostPageCard  post={post} key={post.pageContent.id} />

</div>
        </div>

      ))}
      <nav aria-label="Page navigation">
              <div style={{marginLeft: "30%",
    '@media (max-width: 767px)': {
      marginLeft: "30%",
    }}} className="flex pl-0 rounded list-none flex-wrap">{pageItems}</div>
            </nav>

    </main>
  );
}

export default  {PostPageCardContainer} ;
