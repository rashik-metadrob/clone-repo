
import React from 'react';
// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import "../assets/css/style.css"
import { BookModal } from '../features/Modal/bookModal';
import { Section1 } from '../features/Sections/Section1';
import { Section2 } from '../features/Sections/Section2';
import { Section3 } from '../features/Sections/Section3';
import { Section4 } from '../features/Sections/Section4';
import { Section5 } from '../features/Sections/Section5';
import { Section6 } from '../features/Sections/Section6';
import { Helmet, HelmetProvider } from "react-helmet-async";

import { Section12 } from '../features/Sections/Section12';

export function HomePage() {

  return (
    <div >

    <Helmet>
    <title>Virtual Retail Store Creation Platform | Metadrob</title>

       <meta name="description" content="Metadrob is a SaaS-based Virtual Showroom Creation Platform offering high-end immersive retail solutions to retailers worldwide. Create your own 3D store using unique drag-and-drop. No code needed. Register now!"  data-react-helmet="true"/>
     </Helmet>
    {/* <Section12/> */}
<div style={{ height: '200px' }}></div>
      <BookModal />
      <Section1/>
      
      <Section2/>
      <Section3/>
      <Section4/>
      <Section5/>
      <Section6/>
    </div>
  );
}

export default HomePage;
