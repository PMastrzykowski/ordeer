import React from "react";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
} from "@stripe/react-stripe-js";
class SplitFieldsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CardNumberElement: {
                brand: "unknown",
                complete: false,
                error: undefined,
            },
            CardExpiryElement: {
                complete: false,
                error: undefined,
            },
            CardCvcElement: {
                complete: false,
                error: undefined,
            },
        };
    }
    submit = () => {
        this.props.startPaying();
        if (this.props.stripe && this.props.elements) {
            const cardElement = this.props.elements.getElement(
                CardNumberElement
            );
            this.props.handleResult(cardElement, this.props.stripe);
        } else {
            console.log("Stripe.js hasn't loaded yet.");
            this.props.stopPaying();
        }
    };
    render() {
        return (
            <form onSubmit={this.props.payingStatus ? null : this.submit}>
                <div className={`row upper`}>
                    <div className={`section ${typeof this.state.CardNumberElement.error !== "undefined" ? 'error': ''}`}>
                        <label className={`box-label`}>
                            Card number
                            <CardNumberElement
                                onChange={(e) =>
                                    this.setState({
                                        CardNumberElement: {
                                            brand: e.brand,
                                            complete: e.complete,
                                            error: e.error,
                                        },
                                    })
                                }
                            />
                            <div className={`error-text`}>{typeof this.state.CardNumberElement.error !== "undefined"
                        ? this.state.CardNumberElement.error.message
                        : ""}</div>
                        </label>
                    </div>
                </div>
                <div className={`row lower`}>
                <div className={`section ${typeof this.state.CardExpiryElement.error !== "undefined" ? 'error': ''}`}>
                        <label className={`box-label`}>
                            Expiration date
                            <CardExpiryElement
                                onChange={(e) =>
                                    this.setState({
                                        CardExpiryElement: {
                                            complete: e.complete,
                                            error: e.error,
                                        },
                                    })
                                }
                            />
                            <div className={`error-text`}>{typeof this.state.CardExpiryElement.error !== "undefined"
                        ? this.state.CardExpiryElement.error.message
                        : ""}</div>
                        </label>
                    </div>
                    <div className={`section ${typeof this.state.CardCvcElement.error !== "undefined" ? 'error': ''}`}>
                        <label className={`box-label`}>
                            CVC
                            <CardCvcElement
                                onChange={(e) =>
                                    this.setState({
                                        CardCvcElement: {
                                            complete: e.complete,
                                            error: e.error,
                                        },
                                    })
                                }
                            />
                            <div className={`error-text`}>{typeof this.state.CardCvcElement.error !== "undefined"
                        ? this.state.CardCvcElement.error.message
                        : ""}</div>
                        </label>
                    </div>
                </div>
                <div className="error" role="alert">
                    {/* {this.state.CardNumberElement.brand} */}
                </div>
            </form>
        );
    }
}
export default SplitFieldsForm;
