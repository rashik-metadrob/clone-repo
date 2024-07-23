import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPage } from "./utils";
import LazyLoad from "./LazyLoad";
import { LoadingScreen } from "./LoadingScreen";


import withLoader from './IsLoadingHOC.js';
function urlConversions(url){
  let changedURL;
  var n = url.lastIndexOf('/', url.lastIndexOf('/')-1);
  var result = url.substring(n + 1);

  if(result==="blogs"){
    changedURL='/'
  }else if(url.includes("blogs/")){
      const pattern = /blogs\/page-(\d+)/;
      const match = result.match(pattern);
      if (match) {
        const pageDetails = match[1];
        changedURL='/'+"page-"+pageDetails
      } else {
        changedURL='/'+result
      }

  }

  return changedURL
}
export function PageProxy(props,ssetLoading) {
  const location = useLocation();
  const [pageView, setPageView] = useState(null);
  const [loading, setLoading] = useState(true);
  function wait(time) {
      return new Promise(resolve => {
          setTimeout(resolve, time);
      });
  }
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);

          await wait(5000);
      try {
        setLoading(true);

        let url = urlConversions(location.pathname)
        if(url===null){
          setLoading(false);
          return
        }
        console.log(url)
        const data = await getPage(url);
        const {pageType} = data;
        const PageComponent = LazyLoad[pageType];
        const view = <PageComponent {...props} {...data}  />;
        setPageView(view);
      } catch (err) {
        console.log(JSON.parse(err));
      }
      setLoading(false);

    };

    fetchPageData();
  }, [location, props]);

  if (loading) {

    return <LoadingScreen/>;
  }

  if (pageView) {
    return (
      <React.Suspense fallback={LoadingScreen}>{pageView}</React.Suspense>
    );
  } else {
    return <div>Error when loading content</div>;
  }
}
export  default withLoader(PageProxy);
