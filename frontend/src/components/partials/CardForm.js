import React from "react";
import { CardElement } from "@stripe/react-stripe-js";
class SplitFieldsForm extends React.Component {
    handleChange = ({ error }) => {
        if (error) {
            this.props.setErrors({ card: error.message });
        } else {
            this.props.setErrors({ card: "" });
        }
    };
    handleSubmit = (evt) => {
        evt.preventDefault();
        this.props.startPaying();
        if (this.props.stripe) {
            const cardElement = this.props.elements.getElement(CardElement);
            this.props.handleResult(cardElement, this.props.stripe);
        } else {
            console.log("Stripe.js hasn't loaded yet.");
            this.props.stopPaying();
        }
    };
    render() {
        return (
            <form
                onSubmit={this.props.payingStatus ? null : this.handleSubmit}
            >
                <CardElement />
                <div className="error" role="alert">
                    {this.props.errors.card}
                </div>
                {this.props.payingStatus ? (
                    <button className={`pay`}>{this.props.loadingText}</button>
                ) : (
                    <input
                        type={"submit"}
                        className={`pay`}
                        onClick={this.handleSubmit}
                        value={this.props.buttonText}
                    />
                )}
            </form>
        );
    }
}
export default SplitFieldsForm;
