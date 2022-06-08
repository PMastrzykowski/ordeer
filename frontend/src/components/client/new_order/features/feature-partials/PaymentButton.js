import React, { useEffect, useState } from "react";
import {
    PaymentRequestButtonElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from 'axios';
import StatusMessages, { useMessages } from "./StatusMessages";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import {
    newOrderStartPaying,
    newOrderStopPaying,
} from "../../../../../actions/newOrder";

const PaymentButton = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [messages, addMessage] = useMessages();

    useEffect(() => {
        if (!stripe || !elements) {
            return;
        }
        // this.props.newOrderStartPaying();
        // axios
        //     .get(`/api/stripe/plans`)
        //     .then((res) => {
        //         if (res.data.success) {
        //             this.props.stripeSetProducts(res.data.products.data);
        //         } else {
        //             console.log(res.data);
        //         }
        //     })
        //     .catch((err) => {});
        const pr = stripe.paymentRequest({
            country: "US",
            currency: "usd",
            total: {
                label: "Demo total",
                amount: 1999,
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        // Check the availability of the Payment Request API.
        pr.canMakePayment().then((result) => {
            if (result) {
                setPaymentRequest(pr);
            }
        });

        pr.on("paymentmethod", async (e) => {
            const { error: backendError, clientSecret } = await fetch(
                "/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentMethodType: "card",
                        currency: "usd",
                    }),
                }
            ).then((r) => r.json());

            if (backendError) {
                addMessage(backendError.message);
                return;
            }

            addMessage("Client secret returned");

            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(
                    clientSecret,
                    {
                        payment_method: e.paymentMethod.id,
                    },
                    { handleActions: false }
                );

            if (stripeError) {
                // Show error to your customer (e.g., insufficient funds)
                addMessage(stripeError.message);
                return;
            }

            // Show a success message to your customer
            // There's a risk of the customer closing the window before callback
            // execution. Set up a webhook or plugin to listen for the
            // payment_intent.succeeded event that handles any business critical
            // post-payment actions.
            addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
        });
    }, [stripe, elements, addMessage]);

    return (
        <>
            {paymentRequest ? (
                <PaymentRequestButtonElement
                    options={{
                        paymentRequest,
                        style: {
                            paymentRequestButton: {
                                theme: "dark",
                                height: "64px",
                            },
                        },
                    }}
                />
            ) : (
                <button className={"order-now"}>Order now</button>
            )}

            <StatusMessages messages={messages} />
        </>
    );
};
const mapStateToProps = (state) => {
    return {
        newOrder: state.newOrder,
    };
};
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
          newOrderStartPaying,
          newOrderStopPaying,
        },
        dispatch
    );

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(PaymentButton);