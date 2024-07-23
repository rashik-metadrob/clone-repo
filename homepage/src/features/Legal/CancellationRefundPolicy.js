import React from 'react';
import './TermsAndConditions.css'; // Import your CSS file

function CancellationRefundPolicy() {
  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">
      <div className="terms-container">
        <h1 className="white-bold">Cancellation and Refund Policy</h1>
        <p className="left-align" style={{ marginTop: '10%' }}>
At Metadrob, we strive to provide an exceptional virtual store creation platform that empowers retailers. We understand that sometimes circumstances may require you to cancel your subscription or seek a refund. We are committed to ensuring a transparent and fair process for all our valued users.        </p>
        {/* Section 1: Introduction */}
        <div className="section first">
          <h2 className="white-bold left-align">Cancellation Policy</h2>
          <div >
            <h2 className="white-bold left-align first first">1. Subscription Cancellation:</h2>
            <p className="left-align">
You can cancel your Metadrob subscription at any time by logging into your account and navigating to the subscription settings. Once your subscription is canceled, you will not be charged for any future billing cycles.            </p>
          </div>

          <div  >
            <h2 className="white-bold left-align">2. Billing Cycles:</h2>
            <p className="left-align">
            Please note that Metadrob operates on a subscription-based model, and your cancellation will take effect at the end of your current billing cycle. We do not provide partial refunds for unused portions of your subscription.

            </p>
          </div>
        </div>

        {/* Section 2: Eligibility */}
        <div  className="section">
          <h2 className="white-bold left-align">Refund Policy</h2>
          <p className="left-align">
          Thank you for subscribing at Metadrob. We value your business and want to ensure your satisfaction with the purchase you make on our website. Please read this policy carefully to understand our refund procedures.
          </p>
          <p className="left-align">
Once your cancellation is received and inspected, we will send you an email to notify you that we have received your receipt. We will also notify you about the approval or rejection of your refund.          </p>

<ol>
  <li className="left-align">If your return is approved, your refund will be processed, and a credit will be automatically applied to your original method of payment. Please allow 7 to 10 business days for the refund to reflect on your account.
</li>
  <li className="left-align">If your return is rejected, we will provide you with an explanation for the decision and return the item to you at your expense.
</li>
</ol>

        </div>

        {/* Section 3: Cancellation */}
        <div className="section">
          <h2 className="white-bold left-align">How to Initiate a Cancellation?</h2>
          <p className="left-align">
To initiate a return, please contact our customer support team at info@metadrob.com. Provide your subscription reference number and a reason explained in detail for your cancellation. Our team will guide you through the process.          </p>
        </div>

        {/* Section 4: Refunds */}
        <div  className="section">
          <h2 className="white-bold left-align">Contact Us</h2>
          <p className="left-align">
          If you have any questions about our cancellation and refund policy or need further assistance, please don't hesitate to contact our customer support team at info@metadro.com or +91 95096 19057.
          </p>

          <p className="left-align">
We reserve the right to update or modify this refund policy at any time without prior notice. Please check this page periodically for any changes.          </p>

          <p className="left-align">
Thank you for choosing Metadrob. Your satisfaction is our top priority, and we are committed to providing you with a seamless shopping experience.          </p>
        </div>


      </div>
    </main>
  );
}

export default CancellationRefundPolicy;
