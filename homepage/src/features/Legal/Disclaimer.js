import React from 'react';
import './TermsAndConditions.css'; // Import your CSS file

function Disclaimer() {
  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">


    <div className="terms-container">
     <h1 className="white-bold">Disclaimers</h1>
     <p className="left-align">
At Metadrob, we are passionate about sustainability and committed to making a positive impact on our planet and communities. We believe that every business has a responsibility to minimize its environmental footprint and contribute to a more sustainable future. That's why we have dedicated ourselves to incorporating sustainable practices into every aspect of our virtual store creation platform. Here's how we're making a difference:     </p>
     {/* Section 1: Introduction */}
     <div  className="section first">
       <h2 className="white-bold left-align">1.No Warranties or Guarantees:</h2>
       <p className="left-align">
       Metadrob is provided on an "as-is" and "as available" basis. We make no warranties, express or implied, regarding the accuracy, reliability, availability, or suitability of Metadrob for any particular purpose. Your use of Metadrob is at your own risk.
       </p>
     </div>

     {/* Section 2: Eligibility */}
     <div className="section">
       <h2 className="white-bold left-align">2.User Responsibility:</h2>
       <p className="left-align">
       You are solely responsible for the content you create, upload, or share on Metadrob and the consequences of such actions. We do not endorse or guarantee the accuracy, completeness, or legality of user-generated content on our platform.       </p>

     </div>

     {/* Section 3: Account Creation */}
     <div className="section">
       <h2 className="white-bold left-align">3.Third-Party Content:</h2>
       <p className="left-align">
       Metadrob may include links to third-party websites, services, or resources. We have no control over and assume no responsibility for the content, privacy policies, or practices of these third parties. Any interactions with third-party content are at your own discretion and risk.
       </p>
     </div>

     {/* Section 4: Use of the Site and Services */}
     <div  className="section">
       <h2 className="white-bold left-align">4.Intellectual Property:</h2>
       <p className="left-align">
       All intellectual property rights associated with Metadrob, including but not limited to copyrights, trademarks, and patents, are the property of Metadrob or its licensors. You may not use, reproduce, distribute, or modify Metadrob's content or design without prior written consent.
       </p>
     </div>

     {/* Section 5: Intellectual Property */}
     <div  className="section">
       <h2 className="white-bold left-align">5.Limitation of Liability:</h2>
       <p className="left-align">
       To the extent permitted by law, we shall not be liable for any indirect, incidental, consequential, punitive, or special damages arising out of or in any way connected with your use of Metadrob, even if we have been advised of the possibility of such damages.
       </p>
     </div>

     {/* Section 6: Links to Other Sites */}
     <div className="section">
       <h2 className="white-bold left-align">6.Privacy:</h2>
       <p className="left-align">
Please review our Privacy Policy to understand how we collect, use, and protect your personal information while using Metadrob.         </p>
   </div>

     {/* Section 7: Disclaimer of Warranties */}
     <div  className="section">
       <h2 className="white-bold left-align">7.Modification and Termination:</h2>
       <p className="left-align">

       We reserve the right to modify, suspend, or terminate Metadrob or any part thereof at any time and without notice. We are not liable for any losses resulting from such actions.
       </p>
     </div>

     {/* Section 8: Limitation of Liability */}
     <div  className="section">
       <h2 className="white-bold left-align">8.Governing Law</h2>
       <p className="left-align">
       These Terms and Conditions are governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law principles.
       </p>
     </div>



     {/* Section 12: Contact Us */}
     <div  className="section">
       <h2 className="white-bold left-align">Contact Us</h2>
       <p className="left-align">
         If you have any questions about these Terms, please contact us at <span className="white-bold">info@metadrob.com</span>.
       </p>
     </div>
   </div>
    </main>
  );
}

export default Disclaimer;
