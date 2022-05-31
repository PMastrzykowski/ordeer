import React from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Modal from "../partials/Modal";
import UISwitch from "../partials/Switch";
import { api } from "../../api";
import { connect } from "react-redux";
import { ElementsConsumer, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Select from "react-select";
import currency from "currency.js";
import {
    plansStartPaying,
    plansStopPaying,
    plansSetErrors,
    plansOpenModal,
    plansCloseModal,
    plansDetachPaymentMethod,
    plansAttachPaymentMethod,
    plansToggleYearly,
    plansSetYearly,
    plansSetCurrency,
    plansPersonalFormToggleVisibility,
    plansTaxFormToggleVisibility,
    plansPaymentMethodFormToggleVisibility,
} from "../../actions/plans";
import CardForm from "../partials/CardForm2";
import PersonalForm from "../partials/PersonalForm";
const stripe = loadStripe("pk_test_qHxTXKGEwmRKjMlcVaniPj1100yRvKKPZY");

class Plans extends React.Component {
    handleAttachPaymentMethod = async (cardElement, stripe) => {
        this.props.plansStartPaying();
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });
        if (error) {
            this.props.plansStopPaying();
            console.log("Payment method can not be saved!");
            // Display error.message in your UI.
        } else {
            const response = await axios.post(
                `${api}/api/stripe/attachpaymentmethod`,
                {
                    stripeCustomerId: this.props.auth.user.stripeCustomerId,
                    paymentMethod: paymentMethod.id,
                }
            );
            if (response.data.success) {
                this.props.plansAttachPaymentMethod(
                    paymentMethod.id,
                    {
                        email: paymentMethod.billing_details.email,
                        name: paymentMethod.billing_details.name,
                        phone: paymentMethod.billing_details.phone,
                    },
                    {
                        brand: paymentMethod.card.brand,
                        exp_month: paymentMethod.card.exp_month,
                        exp_year: paymentMethod.card.exp_year,
                        last4: paymentMethod.card.last4,
                    }
                );
                console.log("Payment method saved!");
                console.log(response);
            } else {
                console.log(response);
            }
        }
    };
    handleDetachPaymentMethod = async () => {
        this.props.plansStartPaying();
        const response = await axios.post(
            `${api}/api/stripe/detachpaymentmethod`,
            {
                stripeCustomerId: this.props.auth.user.stripeCustomerId,
                paymentMethod: this.props.auth.user.default_payment_method,
            }
        );
        if (response.data.success) {
            console.log("Payment method detached!");
            this.props.plansDetachPaymentMethod();
            console.log(response);
        } else {
            console.log(response);
        }
    };
    priceSelector = (product, isYearly) => {
        let productPrices = this.props.plans.prices.filter(
            (price) =>
                price.product === product &&
                price.currency === this.props.plans.currency.value &&
                price.recurring.interval === (isYearly ? "year" : "month")
        );
        if (productPrices.length > 0) {
            return productPrices[0].unit_amount_decimal;
        } else {
            return "0";
        }
    };
    renderModal = () => {
        switch (this.props.plans.modal.view) {
            case "remove-payment-method":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Remove payment method</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Are you sure you want to remove this payment
                                    method?
                                </div>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.plansCloseModal}
                            >
                                Cancel
                            </button>
                            {this.props.plans.modal.status === "loading" ? (
                                <button>Loading...</button>
                            ) : (
                                <button
                                    className="positive"
                                    onClick={this.handleDetachPaymentMethod}
                                >
                                    Remove payment method
                                </button>
                            )}
                        </div>
                    </div>
                );
            case "switch-to-plan":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Switch to plan</div>
                        </div>
                        <div className="modal-essence">
                            <div id="switch-to-plan">
                                <div className="content-left">
                                    <section>
                                        <div className="plan-title">
                                            Max Plan
                                        </div>
                                        <div className="plan-description">
                                            <p>
                                                Comfort plan is designed for all
                                                small businesses willing to try
                                                selling their services in an
                                                innovative way. Try now,
                                                terminate whenever you feel
                                                like.
                                            </p>
                                        </div>
                                    </section>
                                </div>
                                <div className="content-right">
                                    <section className="payment-method">
                                        <h1>Payment method</h1>
                                        {this.props.auth.user
                                            .default_payment_method !== "" ? (
                                            <div id={`payment-method`}>
                                                <h2>Saved Payment method</h2>
                                                <p>
                                                    This card will be used for
                                                    this and future payments.
                                                </p>
                                                <div className="card">
                                                    <div className="card-left">
                                                        <div className="card-data">
                                                            <div className="card-data-label">
                                                                Brand
                                                            </div>
                                                            <div className="card-data-content">
                                                                {
                                                                    this.props
                                                                        .auth
                                                                        .user
                                                                        .paymentMethod
                                                                        .card
                                                                        .brand
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="card-data">
                                                            <div className="card-data-label">
                                                                Card number
                                                            </div>
                                                            <div className="card-data-content">
                                                                ****{" "}
                                                                {
                                                                    this.props
                                                                        .auth
                                                                        .user
                                                                        .paymentMethod
                                                                        .card
                                                                        .last4
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="card-data">
                                                            <div className="card-data-label">
                                                                Expiration
                                                            </div>
                                                            <div className="card-data-content">
                                                                {
                                                                    this.props
                                                                        .auth
                                                                        .user
                                                                        .paymentMethod
                                                                        .card
                                                                        .exp_month
                                                                }
                                                                /
                                                                {
                                                                    this.props
                                                                        .auth
                                                                        .user
                                                                        .paymentMethod
                                                                        .card
                                                                        .exp_year
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="remove-text">
                                                    Or{" "}
                                                    <span
                                                        className="remove-card"
                                                        onClick={() =>
                                                            this.props.plansOpenModal(
                                                                "remove-payment-method"
                                                            )
                                                        }
                                                    >
                                                        remove this payment
                                                        method
                                                    </span>{" "}
                                                    and add a new one
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className={`add-payment-method`}
                                            >
                                                <p>
                                                    Please put your card details
                                                    below. We will save it for
                                                    future payments.
                                                </p>
                                                <div
                                                    className={`card-form stripe-manager-card-form`}
                                                >
                                                    <Elements stripe={stripe}>
                                                        <ElementsConsumer>
                                                            {({
                                                                elements,
                                                                stripe,
                                                            }) => (
                                                                <CardForm
                                                                    ref={(e) =>
                                                                        (this.childCardForm = e)
                                                                    }
                                                                    elements={
                                                                        elements
                                                                    }
                                                                    stripe={
                                                                        stripe
                                                                    }
                                                                    handleResult={
                                                                        this
                                                                            .handleAttachPaymentMethod
                                                                    }
                                                                    startPaying={
                                                                        this
                                                                            .props
                                                                            .plansStartPaying
                                                                    }
                                                                    stopPaying={
                                                                        this
                                                                            .props
                                                                            .plansStopPaying
                                                                    }
                                                                    payingStatus={
                                                                        this
                                                                            .props
                                                                            .plans
                                                                            .paying
                                                                    }
                                                                />
                                                            )}
                                                        </ElementsConsumer>
                                                    </Elements>
                                                </div>
                                            </div>
                                        )}
                                    </section>
                                    {/* <PersonalForm
                                        savingStatus={null}
                                        startSaving={this.handleUpdateCustomerDetails}
                                    /> */}
                                    <section className={`summary`}>
                                        <h1>Summary</h1>
                                        <div className={`summary-settings`}>
                                            <div className={`summary-setting`}>
                                                <label className={`box-label`}>
                                                    Currency
                                                    <Select
                                                        defaultValue={
                                                            this.props.plans
                                                                .currency
                                                        }
                                                        isMulti={false}
                                                        name={""}
                                                        options={
                                                            this.props.plans
                                                                .currencies
                                                        }
                                                        onChange={(e) => {
                                                            this.props.plansSetCurrency(
                                                                e
                                                            );
                                                        }}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                    />
                                                </label>
                                            </div>
                                            <div className={`summary-setting`}>
                                                <label className={`box-label`}>
                                                    Billing
                                                    <Select
                                                        defaultValue={{
                                                            label: "Yearly",
                                                            value: "yearly",
                                                        }}
                                                        isMulti={false}
                                                        name={""}
                                                        options={
                                                            this.props.plans
                                                                .billingPeriods
                                                        }
                                                        onChange={(e) => {
                                                            this.props.plansSetYearly(
                                                                e.value
                                                            );
                                                        }}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className={`summary-receipt`}>
                                            <div
                                                className={`summary-receipt-items`}
                                            >
                                                {this.props.plans.isYearly
                                                    ? `12 x ${currency(
                                                          this.priceSelector(
                                                              this.props.plans
                                                                  .modal
                                                                  .productId,
                                                              this.props.plans
                                                                  .isYearly
                                                          ),
                                                          {
                                                              fromCents: true,
                                                              symbol: "",
                                                          }
                                                      )
                                                          .distribute(12)[0]
                                                          .format()}`
                                                    : currency(
                                                          this.priceSelector(
                                                              this.props.plans
                                                                  .modal
                                                                  .productId,
                                                              this.props.plans
                                                                  .isYearly
                                                          ),
                                                          {
                                                              fromCents: true,
                                                              symbol: "",
                                                          }
                                                      ).format()}{" "}
                                                {
                                                    this.props.plans.currency
                                                        .label
                                                }
                                            </div>
                                            {this.props.plans.isYearly ? (
                                                <div
                                                    className={`summary-receipt-discount`}
                                                >
                                                    <div
                                                        className={`summary-receipt-discount-label`}
                                                    >
                                                        -10%
                                                    </div>
                                                    <div
                                                        className={`summary-receipt-discount-amount`}
                                                    >
                                                        {currency(
                                                            this.priceSelector(
                                                                this.props.plans
                                                                    .modal
                                                                    .productId,
                                                                false
                                                            ),
                                                            {
                                                                fromCents: true,
                                                                symbol: "",
                                                            }
                                                        )
                                                            .multiply(12)
                                                            .format()}{" "}
                                                        {
                                                            this.props.plans
                                                                .currency.label
                                                        }
                                                    </div>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <div
                                                className={`summary-receipt-total`}
                                            >
                                                <div
                                                    className={`summary-receipt-total-label`}
                                                >
                                                    Total:
                                                </div>
                                                <div
                                                    className={`summary-receipt-total-amount`}
                                                >
                                                    {currency(
                                                        this.priceSelector(
                                                            this.props.plans
                                                                .modal
                                                                .productId,
                                                            this.props.plans
                                                                .isYearly
                                                        ),
                                                        {
                                                            fromCents: true,
                                                            symbol: "",
                                                        }
                                                    ).format()}{" "}
                                                    {
                                                        this.props.plans
                                                            .currency.label
                                                    }
                                                </div>
                                            </div>
                                            <div
                                                className={`summary-receipt-billing`}
                                            >
                                                Billing{" "}
                                                {this.props.plans.isYearly
                                                    ? "yearly"
                                                    : "monthly"}
                                            </div>
                                        </div>
                                        <section className={`confirm-wrapper`}>
                                            <button className={`confirm`}>
                                                Confirm order
                                            </button>
                                            <div className={`or`}>or</div>
                                            <div
                                                className={`cancel`}
                                                onClick={
                                                    this.props.plansCloseModal
                                                }
                                            >
                                                Cancel
                                            </div>
                                        </section>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return "";
        }
    };
    render = () => {
        return (
            <>
                <div id="main-title">
                    <div className={`main-title-inner`}>Plans and Billing</div>
                </div>
                <div id="plans">
                    <div className={`billing`}>
                        <h1>Billing</h1>
                        <div className={`tabs`}>
                            <div
                                className="tab-header"
                                onClick={
                                    this.props
                                        .plansPaymentMethodFormToggleVisibility
                                }
                            >
                                <div className="tab-header-left">
                                    <h3>Payment method</h3>
                                </div>
                                <div
                                    className={`tab-header-right ${
                                        this.props.plans.paymentMethodForm
                                            .visible
                                            ? "open"
                                            : ""
                                    }`}
                                ></div>
                            </div>
                            <div
                                className={`tab ${
                                    this.props.plans.paymentMethodForm.visible
                                        ? "open"
                                        : ""
                                }`}
                            >
                                {this.props.auth.user.default_payment_method !==
                                "" ? (
                                    <div id={`payment-method`}>
                                        <h2>Saved Payment method</h2>
                                        <p>
                                            This card will be used if you decide
                                            to subscribe our paid plans. All
                                            data is kept securely by Stripe.
                                        </p>
                                        <div className="card">
                                            <div className="card-left">
                                                <div className="card-data">
                                                    <div className="card-data-label">
                                                        Brand
                                                    </div>
                                                    <div className="card-data-content">
                                                        {
                                                            this.props.auth.user
                                                                .paymentMethod
                                                                .card.brand
                                                        }
                                                    </div>
                                                </div>
                                                <div className="card-data">
                                                    <div className="card-data-label">
                                                        Card number
                                                    </div>
                                                    <div className="card-data-content">
                                                        ****{" "}
                                                        {
                                                            this.props.auth.user
                                                                .paymentMethod
                                                                .card.last4
                                                        }
                                                    </div>
                                                </div>
                                                <div className="card-data">
                                                    <div className="card-data-label">
                                                        Expiration
                                                    </div>
                                                    <div className="card-data-content">
                                                        {
                                                            this.props.auth.user
                                                                .paymentMethod
                                                                .card.exp_month
                                                        }
                                                        /
                                                        {
                                                            this.props.auth.user
                                                                .paymentMethod
                                                                .card.exp_year
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-right">
                                                <button
                                                    onClick={() =>
                                                        this.props.plansOpenModal(
                                                            "remove-payment-method"
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div id={`add-payment-method`}>
                                        <h2>Add payment method</h2>
                                        <p>
                                            To use paid plans, please save your
                                            card details. All data is securely
                                            stored by Stripe.
                                        </p>
                                        <div
                                            className={`card-form stripe-manager-card-form`}
                                        >
                                            <Elements stripe={stripe}>
                                                <ElementsConsumer>
                                                    {({ elements, stripe }) => (
                                                        <CardForm
                                                            ref={(e) =>
                                                                (this.childCardForm = e)
                                                            }
                                                            elements={elements}
                                                            stripe={stripe}
                                                            handleResult={
                                                                this
                                                                    .handleAttachPaymentMethod
                                                            }
                                                            startPaying={
                                                                this.props
                                                                    .plansStartPaying
                                                            }
                                                            stopPaying={
                                                                this.props
                                                                    .plansStopPaying
                                                            }
                                                            payingStatus={
                                                                this.props.plans
                                                                    .paying
                                                            }
                                                        />
                                                    )}
                                                </ElementsConsumer>
                                            </Elements>
                                        </div>
                                        {this.props.plans.paying ? (
                                            <button className={`pay`}>
                                                Saving...
                                            </button>
                                        ) : (
                                            <button
                                                className={`pay`}
                                                onClick={() =>
                                                    this.childCardForm.submit()
                                                }
                                            >
                                                Save
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div
                                className="tab-header"
                                onClick={
                                    this.props
                                        .plansPersonalFormToggleVisibility
                                }
                            >
                                <div className="tab-header-left">
                                    <h3>Personal information</h3>
                                </div>
                                <div
                                    className={`tab-header-right ${
                                        this.props.plans.personalForm
                                            .visible
                                            ? "open"
                                            : ""
                                    }`}
                                ></div>
                            </div>
                            <div
                                className={`tab ${
                                    this.props.plans.personalForm.visible
                                        ? "open"
                                        : ""
                                }`}
                            >
                                <div id={`add-payment-method`}>
                                    <h2>Add personal details</h2>
                                    <p>
                                        Please give us some more details about
                                        you. We need them to prepare invoices
                                        for you.
                                    </p>
                                    <PersonalForm
                                        savingStatus={null}
                                        startSaving={
                                            this.handleUpdateCustomerDetails
                                        }
                                    />
                                </div>
                            </div>
                            {/* <div
                                className="tab-header"
                                onClick={
                                    this.props
                                        .plansTaxFormToggleVisibility
                                }
                            >
                                <div className="tab-header-left">
                                    <h3>Tax information</h3>
                                </div>
                                <div
                                    className={`tab-header-right ${
                                        this.props.plans.taxForm
                                            .visible
                                            ? "open"
                                            : ""
                                    }`}
                                ></div>
                            </div>
                            <div
                                className={`tab ${
                                    this.props.plans.taxForm.visible
                                        ? "open"
                                        : ""
                                }`}
                            >
                                <div id={`add-payment-method`}>
                                    <h2>Add tax details</h2>
                                    <p>
                                        Please give us some more details about
                                        you. We need them to prepare invoices
                                        for you.
                                    </p>
                                    <TaxForm
                                        savingStatus={null}
                                        startSaving={
                                            this.handleUpdateCustomerDetails
                                        }
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div id={`available-plans`}>
                        <h1>Plans</h1>
                        <div className={`interval-wrapper`}>
                            <div className={`interval-value`}>
                                Billing monthly
                                <div
                                    className={`line ${
                                        !this.props.plans.isYearly ? "long" : ""
                                    }`}
                                />
                            </div>
                            <div className={`interval-switch`}>
                                <UISwitch
                                    checked={this.props.plans.isYearly}
                                    onChange={() =>
                                        this.props.plansToggleYearly()
                                    }
                                />
                            </div>
                            <div className={`interval-value`}>
                                Billing yearly
                                <div
                                    className={`line ${
                                        this.props.plans.isYearly ? "long" : ""
                                    }`}
                                />
                            </div>
                        </div>
                        {this.props.plans.products.map((plan, i) => (
                            <div key={i} className={`plan`}>
                                <div className={`plan-header`}>
                                    <div className={`plan-name`}>
                                        {plan.name}
                                    </div>
                                    <div className={`plan-price`}>
                                        <div className={`plan-price-value`}>
                                            {this.props.plans.isYearly
                                                ? currency(
                                                      this.priceSelector(
                                                          plan.id,
                                                          this.props.plans
                                                              .isYearly
                                                      ),
                                                      {
                                                          fromCents: true,
                                                          symbol: "",
                                                      }
                                                  )
                                                      .distribute(12)[0]
                                                      .format()
                                                : currency(
                                                      this.priceSelector(
                                                          plan.id,
                                                          this.props.plans
                                                              .isYearly
                                                      ),
                                                      {
                                                          fromCents: true,
                                                          symbol: "",
                                                      }
                                                  ).format()}
                                        </div>
                                        <div
                                            className={`plan-price-descriptors`}
                                        >
                                            <div
                                                className={`plan-price-descriptors-currency`}
                                            >
                                                {
                                                    this.props.plans.currency
                                                        .label
                                                }
                                            </div>

                                            <div
                                                className={`plan-price-descriptors-interval`}
                                            >
                                                / month
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={`plan-body`}></div>
                                <div className={`plan-footer`}>
                                    <button
                                        className={`switch-to`}
                                        onClick={() =>
                                            this.props.plansOpenModal(
                                                "switch-to-plan",
                                                { productId: plan.id }
                                            )
                                        }
                                    >
                                        Switch to this plan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Modal
                    open={this.props.plans.modal.isOpen}
                    onClose={this.props.plansCloseModal}
                >
                    {this.renderModal()}
                </Modal>
            </>
        );
    };
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    plans: state.plans,
});
const mapDispatchToProps = {
    plansStartPaying,
    plansStopPaying,
    plansSetErrors,
    plansOpenModal,
    plansCloseModal,
    plansDetachPaymentMethod,
    plansAttachPaymentMethod,
    plansToggleYearly,
    plansSetYearly,
    plansSetCurrency,
    plansPersonalFormToggleVisibility,
    plansTaxFormToggleVisibility,
    plansPaymentMethodFormToggleVisibility,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Plans));
