import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { notification } from "antd";

export default function CheckoutForm({
  cart,
  total,
  setIsLoading = () => {},
  cartAmount,
  deliveryAmount
}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${process.env.REACT_APP_HOMEPAGE}/project/payment-result/ORDER`,
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

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <div className="mt-[32px] text-left">
              <div className="flex justify-between">
                  <div className="cart-total-text">
                    Order:
                  </div>
                  <div className="cart-total-text">
                    ${cartAmount}
                  </div>
              </div>
              <div className="flex justify-between mt-[12px]">
                  <div className="cart-total-text">
                    Delivery:
                  </div>
                  <div className="cart-total-text">
                      ${deliveryAmount}
                  </div>
              </div>
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
  );
}