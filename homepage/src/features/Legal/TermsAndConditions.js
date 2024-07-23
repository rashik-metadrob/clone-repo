import React from 'react';
import './TermsAndConditions.css'; // Import your CSS file

function TermsAndConditions() {
  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">


    <div className="terms-container">
     <h1 className="white-bold">Terms and Conditions</h1>

     {/* Section 1: Introduction */}
     <div className="section first">
       <h2 className="white-bold left-align">1.Acceptance of Terms</h2>
       <p className="left-align">
       By accessing or using the Metadrob website ("Website") and the services provided therein ("Services"), you agree to abide by and be bound by these Terms and Conditions. If you do not agree with any part of these Terms and Conditions, you must not use the Website or Services.
       </p>
     </div>

     {/* Section 2: Eligibility */}
     <div className="section">
       <h2 className="white-bold left-align">2.Use of Services</h2>
       <p className="left-align">
You must be of legal age to use the Services in your jurisdiction. You are responsible for ensuring the accuracy and security of your account information. You agree not to use the Services for any unlawful or prohibited purposes.       </p>
     </div>

     {/* Section 3: Account Creation */}
     <div className="section">
       <h2 className="white-bold left-align">3.Intellectual Property</h2>
       <p className="left-align">
       All content and materials on the Website, including but not limited to text, graphics, logos, images, and software, are the property of Metadrob or its licensors and are protected by intellectual property laws. You may not use, reproduce, or distribute these materials without prior written consent.
       </p>
     </div>

     {/* Section 4: Use of the Site and Services */}
     <div className="section">
       <h2 className="white-bold left-align">4.User-Generated Content</h2>
       <p className="left-align">
       Users are solely responsible for the content they upload, create, or share on the Website. Metadrob does not endorse or guarantee the accuracy or legality of user-generated content.
       </p>
     </div>

     {/* Section 5: Intellectual Property */}
     <div className="section">
       <h2 className="white-bold left-align">5.Privacy</h2>
       <p className="left-align">
       Your use of the Website and Services is also governed by our Privacy Policy. By using the Website, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.
       </p>
     </div>

     {/* Section 6: Links to Other Sites */}
     <div className="section">
       <h2 className="white-bold left-align">6.Limitation of Liability</h2>
       <p className="left-align">
Metadrob shall not be liable for any indirect, incidental, consequential, punitive, or special damages arising out of or in any way connected with your use of the Website or Services.       </p>
     </div>

     {/* Section 7: Disclaimer of Warranties */}
     <div className="section">
       <h2 className="white-bold left-align">7.Modifications</h2>
       <p className="left-align">
       Modifications
       Metadrob may modify these Terms and Conditions at any time. It is your responsibility to review these terms periodically. Continued use of the Website and Services after any modifications constitutes your acceptance of the revised Terms and Conditions.
       </p>
     </div>

     {/* Section 8: Limitation of Liability */}
     <div className="section">
       <h2 className="white-bold left-align">8.Governing Law</h2>
       <p className="left-align">
       These Terms and Conditions are governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.
       </p>
     </div>



     {/* Section 12: Contact Us */}
     <div className="section">
       <h2 className="white-bold left-align">Contact Us</h2>
       <p className="left-align">
         If you have any questions about these Terms, please contact us at <span className="white-bold">info@metadrob.com</span>.
       </p>
     </div>
   </div>
    </main>
  );
}

export default TermsAndConditions;
