import React,{useEffect} from 'react';

import { Header } from './features/header/header';
import { BookModal } from './features/Modal/bookModal';
import { PopupCounter } from './features/popup/popoup-counter.js';

import { AboutUs } from './Components/aboutUs';
// import { Pricing } from './Components/pricing';

import {PageProxy} from "./utilities/PageProxy";
import ScrollToTop from "./utilities/ScrollToTop.js";

import { NotFound } from './features/NotFound/NotFound';
import { MixpanelProvider } from 'react-mixpanel-browser';
import {HomePage} from './Components/homePage.js'

import { Footer } from './features/footer/footer';
import {  Routes, Route } from 'react-router-dom'
import './App.css';
import FurniturePage from './Components/furniturePage2';

import Services from './Components/services';

import AutomobilePage from './Components/autoMobile2';
import FashionPage from './Components/fashionPage2';
import TermsAndConditions from './features/Legal/TermsAndConditions';
import FAQ from './features/Legal/FAQ';

import PrivacyPolicy from './features/Legal/PrivacyPolicy';
import { Helmet, HelmetProvider } from "react-helmet-async";

import CancellationRefundPolicy from './features/Legal/CancellationRefundPolicy';
import ContactUs from './features/Legal/ContactUs';
import Disclaimer from './features/Legal/Disclaimer';
import Sustainability from './features/Legal/Sustainability';
import ShippingPolicy from './features/Legal/ShippingPolicy';


// const MIXPANEL_TOKEN = 'b4ef4a96cd79b10e8e07b9bbbc4836fd';

// [OPTIONAL] Custom options to pass to `mixpanel.init()`.
// const MIXPANEL_CONFIG = {
//    track_pageview: true, // Set to `false` by default
//        protocol: 'http',
// };
function App() {

  useEffect(() => {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        targetSection.scrollIntoView();
      }
    }
  });
}, []);

  return (
    <div className="App">
    <Header />
  <HelmetProvider>
      <BookModal />
      <PopupCounter/>
       {/* Routes nest inside one another. Nested route paths build upon
             parent route paths, and nested route elements render inside
             parent route elements. See the note about <Outlet> below. */}
             <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/aboutus" element={<AboutUs />} />
             <Route path="/furniturestore" element={<FurniturePage />} />
             <Route path="/automobile" element={<AutomobilePage />} />
             <Route path="/services" element={<Services />} />

             <Route path="/fashion" element={<FashionPage />} />
             <Route path="/blogs/*" element={<PageProxy/>}/>
             <Route path="*" element={<NotFound />} />
             <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
             <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
             <Route path="/CancellationRefundPolicy" element={<CancellationRefundPolicy />} />
             <Route path="/ContactUs" element={<ContactUs />} />
             <Route path="/shipingPolicy" element={<ShippingPolicy />} />
             {/* <Route path="/Pricing" element={<Pricing />} /> */}
             <Route path="/Disclaimer" element={<Disclaimer />} />
             <Route path="/Sustainability" element={<Sustainability />} />
             <Route path="/FAQ" element={<FAQ />} />

     </Routes>


       <Footer />
       <ScrollToTop/>

  </HelmetProvider>
     </div>




  );
}

export default App;
