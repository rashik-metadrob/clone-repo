import "./ShippingPolicy.css";

export default () => {
  return (
    <main role="main" className="w-full sm:w-2/3 md:w-3/4 lg:w-8/12 px-2 mb-4">
      <div className="terms-container text-start">
        <h1 class="white-bold text-center">Shipping And Delivery</h1>
        <section className="terms-section terms-section--first">
          Thank you for choosing Metadrob. As a provider of SaaS (Software as a
          Service) solutions, our delivery process differs from physical goods.
          Here’s what you need to know about obtaining access to our software
          services:
        </section>

        <section className="terms-section">
          <h2 className="terms-title">Digital Delivery</h2>
          <ul>
            <li>
              Instant Access: Upon successful payment, you will gain immediate
              access to the software or service you’ve subscribed to. An email
              confirmation, along with any necessary instructions for how to
              begin using the service, will be sent to the email address you
              provide at checkout.
            </li>
            <li>
              No Physical Shipping: As our products are entirely digital and
              accessed via the web or through cloud-based applications, there
              will be no physical delivery of any goods. This means no waiting
              times for shipping or handling, and no shipping fees.
            </li>
            <li>
              Account Creation: For new customers, part of the checkout process
              may include creating an account with us. This account will be your
              portal for accessing the services, managing your subscription, and
              receiving support.
            </li>
            <li>
              Service Updates & Upgrades: All updates or upgrades to our
              software are delivered digitally and will be automatically applied
              or made available in your account, ensuring that you always have
              the latest version.
            </li>
          </ul>
        </section>
        <section className="terms-section terms-section--last">
          <h2 className="terms-title">Support and Assistance</h2>
          <ul>
          <li>Customer Support: Should you encounter any issues accessing or using
          our software, our Customer Support team is here to help. You can reach
          out through info@Metadrob.com , and we’ll ensure you have everything
          you need. </li>
          </ul>
          
          <p style={{ 'margin-top': '3%' }}>For any further questions or concerns regarding our shipping
          policy or how to access your services, please do not hesitate to
          contact us.</p>
        </section>
      </div>
    </main>
  );
};
