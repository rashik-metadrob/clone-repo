import React from 'react';
import './TermsAndConditions.css'; // Import your CSS file

function Sustainability() {
  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">


    <div className="terms-container">
     <h1 className="white-bold">Sustainability</h1>
     <p className="left-align" tyle={{marginTop:"10%"}}>
     At Metadrob, we are passionate about sustainability and committed to making a positive impact on our planet and communities. We believe that every business has a responsibility to minimize its environmental footprint and contribute to a more sustainable future. That's why we have dedicated ourselves to incorporating sustainable practices into every aspect of our virtual store creation platform. Here's how we're making a difference:
     </p>
     {/* Section 1: Introduction */}
     <div  className="section first">
       <h2 className="white-bold left-align">1.Green Hosting and Energy Efficiency:</h2>
       <ol>
         <li className="left-align">We host our virtual stores on eco-friendly servers powered by renewable energy sources, reducing our carbon footprint.

       </li>
         <li className="left-align">Our data centers are optimized for energy efficiency to minimize energy consumption and environmental impact.

       </li>
       </ol>
     </div>

     {/* Section 2: Eligibility */}
     <div  className="section">
       <h2 className="white-bold left-align">2.Reduced Emissions:</h2>
       <ol>
         <li className="left-align">We encourage our employees to work remotely whenever possible, reducing the need for commuting and lowering carbon emissions.


       </li>
         <li className="left-align">We continually assess and optimize our supply chain to minimize transportation-related emissions.


       </li>
       </ol>
     </div>



     <div className="section">
       <h2 className="white-bold left-align">3.Community Engagement:</h2>
       <ol>
         <li className="left-align">We actively support local sustainability initiatives and encourage our employees to participate in volunteer opportunities to give back to their communities.



       </li>
         <li className="left-align">We collaborate with like-minded organizations and nonprofits to promote sustainable business practices and environmental conservation.



       </li>
       </ol>
     </div>


          <div className="section">
            <h2 className="white-bold left-align">4.Continuous Improvement:</h2>
            <ol>
              <li className="left-align">We regularly assess our sustainability efforts and set new goals for improvement to ensure that we are continuously reducing our environmental impact.




            </li>

            </ol>
          </div>
          <p className="left-align">
          By choosing Metadrob as your virtual store creation platform, you are not only getting a powerful and user-friendly solution for your business but also joining us in our mission to create a more sustainable and environmentally responsible e-commerce ecosystem. Together, we can make a significant difference in preserving our planet for future generations. Thank you for being a part of our sustainability journey!
          </p>
   </div>
    </main>
  );
}

export default Sustainability;
