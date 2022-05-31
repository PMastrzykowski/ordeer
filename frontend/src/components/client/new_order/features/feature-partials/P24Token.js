import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import queryString from "query-string";
import { stripeTokenError } from "../../../../../actions/stripe";
import { setQrData } from '../../../../../actions/newOrder';
import { api } from "../../../../../api";
import { socket } from "../../../../../socket";
import { loadStripe } from "@stripe/stripe-js";

class Token extends React.Component {
    componentDidMount = async () => {
        const stripe = await loadStripe("pk_test_qHxTXKGEwmRKjMlcVaniPj1100yRvKKPZY");
        const params = queryString.parse(this.props.location.search);
        const sessionId = this.props.match.params.id;
        if (params.payment_intent_client_secret) {
            const { paymentIntent, error } = await stripe.retrievePaymentIntent(
                params.payment_intent_client_secret
            );
            if (error) {
                // Handle error here
                this.props.stripeTokenError();
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                axios
                    .post(`${api}/api/stripe/p24success`, {
                        sessionId,
                        paymentIntent
                    })
                    .then((res) => {
                        if (!res.data.success) {
                            this.props.stripeTokenError();
                        } else {
                            socket.emit("newOrder", res.data.updatedOrder);
                            window.location = `http://localhost:3000/neworder/${res.data.updatedOrder.point}/${sessionId}`
                        }
                    })
                    .catch((err) => {
                        this.props.stripeTokenError();
                    });
            }
        } else {
            this.props.stripeTokenError();
        }
    };
    render = () => {
        return this.props.stripe.tokenError ? (
            <div>An error appeared</div>
        ) : (
            <div className={`initial-loader`}>
                <div className="cssload-container">
                    <div className="cssload-speeding-wheel"></div>
                </div>
            </div>
        );
    };
}
const mapStateToProps = (state) => ({
    stripe: state.stripe,
});
const mapDispatchToProps = {
    stripeTokenError,
    setQrData
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Token));
