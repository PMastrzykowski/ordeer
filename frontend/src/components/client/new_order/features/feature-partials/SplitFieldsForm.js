import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    injectStripe,
} from "react-stripe-elements";
import {
    newOrderStartPaying,
    newOrderStopPaying,
    newOrderSetErrors
} from "../../../../../actions/newOrder";

class SplitFieldsForm extends React.Component {
    handleChange = ({ error }) => {
        if (error) {
            this.props.newOrderSetErrors({ card: error.message });
        } else {
            this.props.newOrderSetErrors({ card: "" });
        }
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        this.props.newOrderStartPaying();
        if (this.props.stripe) {
            this.props.stripe.createToken().then((token) => {
                this.props.handleResult(token);
            });
        } else {
            console.log("Stripe.js hasn't loaded yet.");
            this.props.newOrderStopPaying();
        }
    };

    render() {
        return (
            <form
                onSubmit={
                    this.props.newOrder.paying
                        ? null
                        : this.handleSubmit.bind(this)
                }
            >
                <div className="split-form">
                    <label>
                        Card number
                        <CardNumberElement
                            style={{ base: { fontSize: "20px" } }}
                            onChange={this.handleChange}
                        />
                    </label>
                </div>
                <div className="split-form expiry-ccv">
                    <label>
                        Expiration date
                        <CardExpiryElement
                            style={{ base: { fontSize: "20px" } }}
                            onChange={this.handleChange}
                        />
                    </label>
                    <label>
                        CVC
                        <CardCVCElement
                            style={{ base: { fontSize: "20px" } }}
                            onChange={this.handleChange}
                        />
                    </label>
                </div>
                <div className="error" role="alert">
                    {this.props.newOrder.errors.card}
                </div>
                {this.props.newOrder.paying ? (
                    <button className={`pay`}>Processing payment...</button>
                ) : (
                    <input
                        type={"submit"}
                        className={`pay`}
                        onClick={this.handleSubmit}
                        value={`Pay`}
                    />
                )}
            </form>
        );
    }
}
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
            newOrderSetErrors,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectStripe(SplitFieldsForm));
