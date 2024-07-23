import { notification } from "antd";
import "./styles.scss"
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { getStorageUserDetail } from "../../../../utils/storage";
import { CONFIG_TEXT, PAYMENT_GATE, USER_SUBCRIPTION_KEY } from "../../../../utils/constants";
import userSubcriptionApi from "../../../../api/userSubcription.api";
import moment from "moment"

const PaymentHandleElement = ({
    total,
    selectedPricing,
    clientSecret,
    setIsLoading = () => {},
    payPer,
    isPublishProject,
    projectId,
    isChangeToOrther
}) => {
    const currentUser = getStorageUserDetail();
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) {
        return;
      }
  
      setIsLoading(true);

      await onPurchase(selectedPricing);
  
      let returnUrl = `${window.location.origin}${process.env.REACT_APP_HOMEPAGE}/project/payment-result/PRICING_PLAN`;
      if(isPublishProject && projectId){
        returnUrl += `?isPublishProject=${isPublishProject}&projectId=${projectId}`
      }
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });
  
      if (error.type === "card_error" || error.type === "validation_error") {
        notification.error({
          message: error.message
        })
      } else {
        notification.error({
          message: "An unexpected error occurred."
        })
      }
      setIsLoading(false);
    };

    const onPurchase = async (id) => {
        const body = {
          userId: currentUser.id,
          key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
          value: {
            amount: total,
            pricingId: id,
            stripeIntentSecret: clientSecret,
            numOfDate: payPer === "Monthly" ? 30 : 365,
            createdDate: moment(new Date()),
            expiredDate: moment(new Date()).add(payPer === "Monthly" ? 30 : 365, 'day'),
            paymentGate: PAYMENT_GATE.STRIPE
          }
        }
        await userSubcriptionApi.createSubcription(body)
        // .then(rs => {
            // notification.success({
            //     message: CONFIG_TEXT.SUBCRIPT_PRICING_PLAN_SUCCESS
            // })
        // })
    }

    return <>
      <form id="payment-form" className="payment-handle-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" options={{layout: "tabs"}} />
        <div className="mt-[32px] text-left">
            <div className="flex justify-between mt-[12px]">
                <div className="cart-total-text">
                    TOTAL COST
                </div>
                <div className="cart-total-text">
                    ${total}
                </div>
            </div>
            <button className="btn-checkout mt-[32px]" id="submit">
                PAY
            </button>
        </div>
      </form>
    </>
}
export default PaymentHandleElement;