import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    newOrderStartPaying,
    newOrderStopPaying,
    newOrderSetErrors,
} from "../../../../../actions/newOrder";
import { CardElement } from "@stripe/react-stripe-js";
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
            const cardElement = this.props.elements.getElement(CardElement);
            this.props.handleResult(cardElement, this.props.stripe);
        } else {
            console.log("Stripe.js hasn't loaded yet.");
            this.props.newOrderStopPaying();
        }
    };
    render() {
        return (
            <form
                onSubmit={this.props.newOrder.paying ? null : this.handleSubmit}
            >
                <CardElement />
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

export default connect(mapStateToProps, mapDispatchToProps)(SplitFieldsForm);
