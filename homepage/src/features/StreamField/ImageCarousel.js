import React from "react";

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'
require('react-img-carousel/lib/carousel.css');



function ImageCarousel(props) {
  let images=[]
  const API_BASE = "https://www.metadrob.com"
  // const API_BASE = "http://localhost:8000"

   props.value.map((item, index) => (
        images.push({
          original:`${API_BASE}${item.url}`,
          thumbnail:""
        })
      ))
  return (
    <ImageGallery items={images} />
  );
}

export { ImageCarousel };
