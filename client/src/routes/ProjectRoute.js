import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { getStorageToken, getStorageUserDetail } from "../utils/storage";
import LayoutAdmin from "../layouts/layoutAdmin/LayoutAdmin";
import LayoutProject from "../layouts/layoutProject/LayoutProject";

const ProjectRoute = ({}) => {
    useEffect(() => {
        const trackingScriptTag = document.createElement("script")
        trackingScriptTag.id = "trackingScriptTag"
        trackingScriptTag.innerHTML = `
        (function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src=" https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "iwxej5ixib");
        `
        document.body.append(trackingScriptTag)
  
        return () => {
          const tag = document.getElementById('trackingScriptTag')
          if(tag) {
            tag.remove()
          }
        }
    }, [])

    return <LayoutProject />;
}

export default ProjectRoute