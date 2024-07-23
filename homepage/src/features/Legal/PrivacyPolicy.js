import React from 'react';
import './TermsAndConditions.css'; // Import your CSS file

function PrivacyPolicy() {
  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">
      <div className="terms-container">
        <h1 className="white-bold">Privacy Policy</h1>
        <p className="left-align" style={{ marginTop: '10%' }}>

        Metadrob ("we", "our", or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your personal data when you use our virtual store creation platform and associated services (collectively, "Metadrob"). By accessing or using Metadrob, you consent to the practices described in this Privacy Policy.
        </p>
        {/* Section 1: What Information Do We Collect? */}
        <div  className="section first">
          <h2 className="white-bold left-align">1. Information We Collect:</h2>
          <p className="left-align">
          We may collect various types of information, including but not limited to:
          </p>

          <p className="left-align">
            <span className="white-bold left-align">Personal Information:</span> Information that can be used to identify you, such as your name, email address, phone number, and billing information.
          </p>
          <p className="left-align">
            <span className="white-bold left-align">Usage Information:</span> Information about how you interact with Metadrob, including your browsing history, IP address, device information, and geolocation data.

          </p>
          <p className="left-align">
            <span className="white-bold left-align">User Content:</span>Content you create, upload, or share on Metadrob, such as product descriptions, images, and multimedia content.
          </p>
        </div>

        {/* Section 2: How Do We Collect Such Information? */}
        <div  className="section">
          <h2 className="white-bold left-align">2.How We Use Your Information:</h2>
          <p className="left-align">
          We use your information for the following purposes:
          </p>
          <ul className="left-align">
          <li>To provide and improve Metadrob services.</li>
          <li>To personalize your experience and display relevant content.</li>
          <li>To communicate with you, including responding to inquiries and providing customer support.</li>
          <li>To process payments and transactions.</li>
          <li>To send you important updates, promotions, and marketing communications.</li>
          <li>To analyze user behavior and improve our platform's functionality and performance.</li>
          <li>To comply with legal obligations and protect our rights and the rights of others.</li>
        </ul>

        </div>

        {/* Section 3: Why Do We Collect Such Information? */}
        <div  className="section">
          <h2 className="white-bold left-align">3. Information Sharing:</h2>
          <p className="left-align">
          We may share your information with third parties for the following purposes:
          </p>
          <ul>
            <li className="left-align">  <span className="white-bold left-align">Service Providers:</span> We may share your data with trusted third-party service providers who assist us in delivering Metadrob's services. These providers are bound by confidentiality agreements and are prohibited from using your information for any other purpose.</li>
            <li className="left-align">  <span className="white-bold left-align">Legal Compliance:</span> We may disclose your information to comply with legal obligations, respond to government requests, or protect our rights and the rights of others.</li>
            <li className="left-align">  <span className="white-bold left-align">Business Transfers:</span> In the event of a merger, acquisition, or sale of all or part of our assets, your information may be transferred to the acquiring entity.</li>

          </ul>
        </div>

        {/* Section 4: Where Do We Store Personal Information? */}
        <div className="section">
          <h2 className="white-bold left-align">4. Your Choices:</h2>
          <ul className="left-align">
          <li>You can access, update, or delete your personal information by logging into your Metadrob account or contacting us directly.</li>
          <li>You can opt out of receiving marketing communications by following the unsubscribe instructions provided in our emails or by contacting us.</li>

        </ul>

        </div>

        {/* Section 5: How Do We Protect Your Personal Information? */}
        <div className="section">
          <h2 className="white-bold left-align">5. Security:</h2>
          <p className="left-align">
          We employ industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of transmission over the Internet or electronic storage is entirely secure.

          </p>

        </div>

        {/* Section 6: Your Rights and Choices */}
        <div  className="section">
          <h2 className="white-bold left-align">6. Changes to this Privacy Policy:</h2>
          <p className="left-align">
We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the revised Privacy Policy on Metadrob or by other means.          </p>

        </div>

        {/* Section 7: Changes to This Privacy Policy */}
        <div  className="section">
          <h2 className="white-bold left-align">7.Contact Us:</h2>
          <p className="left-align">
          If you have any questions about this Privacy Policy, please contact us at <span className="white-bold">info@metadrob.com</span>.
          </p>
          <p className="left-align">

          By using Metadrob, you acknowledge that you have read and understood this Privacy Policy and agree to its terms and conditions. If you do not agree with this Privacy Policy, please do not use Metadrob.
          </p>

        </div>


      </div>
    </main>
  );
}

export default PrivacyPolicy;
