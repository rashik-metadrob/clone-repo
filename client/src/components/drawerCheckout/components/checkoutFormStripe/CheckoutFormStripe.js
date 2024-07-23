import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { notification } from "antd";

export default function CheckoutFormStripe({
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
            <div className="order-info-container py-[15px]">
                <div className="item">
                    <div className="title">
                        Order:
                    </div>
                    <div className="value">
                        {cartAmount}$
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        Delivery:
                    </div>
                    <div className="value">
                        {deliveryAmount}$
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        Summary:
                    </div>
                    <div className="value">
                        {(cartAmount + deliveryAmount).toFixed(2)}$
                    </div>
                </div>
            </div>
            <div className="footer-container mt-[21px]">
                <button className="btn-save text-[14px] sm:text-[16px] md:text-[20px] px-[21px] py-[8px] md:px-[42px] md:py-[13px]" id="submit">
                    Place Order
                </button>
                <div className="text-amount">
                    {(cartAmount + deliveryAmount).toFixed(2)}$
                </div>
            </div>
        </form>
  );
}