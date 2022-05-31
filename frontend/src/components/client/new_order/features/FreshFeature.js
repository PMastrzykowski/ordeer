import React from "react";
import { withRouter, Redirect } from "react-router";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import {
    updateQrData,
    selectCategory,
    selectItem,
    newOrderAddToCart,
    newOrderIncreaseAmount,
    newOrderDecreaseAmount,
    newOrderToggleCheckoutButtons,
    newOrderCustomizeCartItem,
    newOrderSaveCartItem,
    newOrderRemoveCartItem,
} from "../../../../actions/newOrder";
import { Link } from "react-router-dom";
import OptionMany from "./feature-partials/OptionMany";
import OptionSingle from "./feature-partials/OptionSingle";
import { ElementsConsumer, Elements } from "@stripe/react-stripe-js";
import CardForm from "./feature-partials/CardForm";
import { loadStripe } from "@stripe/stripe-js";
import {
    calculateTotal,
    calculateItemPrice,
    calculateTotalAmount,
    renderCheckout,
} from "../../../../helpers/freshNewOrder";
import animateScrollTo from "animated-scroll-to";
import { Waypoint } from "react-waypoint";
import Slider from "react-slick";
import click from "../../../click.svg";
import PaymentButton from "./feature-partials/PaymentButton";
import { PaymentRequestButtonElement } from "react-stripe-elements";
import ApplePay from "./feature-partials/ApplePay";
import Div100vh from "react-div-100vh";
import * as currency from "currency.js";
import { currencyOptions } from "../../../../helpers/regional";
import { CSSTransition } from "react-transition-group";

const stripe = loadStripe("pk_test_qHxTXKGEwmRKjMlcVaniPj1100yRvKKPZY");
class FreshFeature extends React.Component {
    componentDidMount = () => {
        this.props.selectCategory(
            this.props.newOrder.placeMenu.categories[0].id
        );
        let params = this.props.match.params;
        switch (this.props.contentType) {
            case "item":
                if (
                    this.props.newOrder.placeMenu.items.filter(
                        (item) => item.id === params.item
                    ).length === 0
                ) {
                    this.props.history.push(
                        `/neworder/${params.place}/${params.id}/menu`
                    );
                } else {
                    this.props.selectItem(params.item);
                }
                return;
            case "cart-item":
                if (
                    this.props.newOrder.cart.filter(
                        (item) => item.cartId === params.cartItem
                    ).length === 0
                ) {
                    console.log("chuja");
                    this.props.history.push(
                        `/neworder/${params.place}/${params.id}/menu`
                    );
                } else {
                    this.props.newOrderCustomizeCartItem(params.cartItem);
                }
                return;
            default:
                return;
        }
    };
    viewHi = () => (
        <div id="view-hi" className={this.props.start ? "start" : ""}>
            <div className={`view-hi-image`}>
                {this.props.newOrder.placeMenu.images.map((image) => (
                    <div
                        key={image.id}
                        className={"image-wrapper"}
                        style={{ backgroundImage: `url("${image.url}")` }}
                    />
                ))}
            </div>
            <div className={`view-hi-footer`}>
                <div>
                    <div className={`welcome`}>Welcome to</div>
                    <div className={`place-name`}>
                        {this.props.newOrder.placeName}
                    </div>
                </div>
                <div>
                    <Link to={(location) => `${location.pathname}/menu`}>
                        <button className={`start-button`}>Start</button>
                    </Link>
                </div>
            </div>
        </div>
    );
    viewMenu = () => (
        <div id="view-menu">
            {this.props.newOrder.placeMenu.categories.map(
                (category, categoryIndex) => (
                    <Waypoint
                        scrollableAncestor={window}
                        topOffset={163}
                        bottomOffset={163}
                        onLeave={({ currentPosition }) => {
                            let newCategoryIndex =
                                currentPosition === "below"
                                    ? categoryIndex - 1
                                    : categoryIndex + 1;
                            this.props.selectCategory(
                                this.props.newOrder.placeMenu.categories[
                                    newCategoryIndex
                                ].id
                            );

                            animateScrollTo(
                                this[`category-${newCategoryIndex}-button`],
                                { elementToScroll: this.categoryButtons }
                            );
                        }}
                        key={categoryIndex}
                    >
                        <div
                            className={`view-menu-category`}
                            ref={(div) =>
                                (this[`category-${categoryIndex}`] = div)
                            }
                        >
                            <div className={`category-title`}>
                                {category.name}
                            </div>
                            <div className={`view-menu-body`}>
                                {this.props.newOrder.placeMenu.items
                                    .filter(
                                        (item) => item.category === category.id
                                    )
                                    .map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className={`menu-list-item ${
                                                item.available
                                                    ? ""
                                                    : "unavailable"
                                            }`}
                                            onClick={() => {
                                                this.props.selectCategory(
                                                    category.id
                                                );
                                                this.props.selectItem(item.id);
                                                this.props.history.push(
                                                    `${this.props.location.pathname}/${item.id}`
                                                );
                                            }}
                                        >
                                            <div className={`item-image`}>
                                                {item.images.length > 0 && (
                                                    <div
                                                        className={`image`}
                                                        style={{
                                                            backgroundImage: `url(${item.images[0].url})`,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div className={`item-info`}>
                                                <div className={`item-name`}>
                                                    {item.name}
                                                </div>
                                                <div className={`item-price`}>
                                                    {currency(
                                                        item.price,
                                                        currencyOptions(
                                                            this.props.newOrder
                                                                .currency
                                                        )
                                                    ).format()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </Waypoint>
                )
            )}
            <div className={`header`}>
                <Link
                    to={() =>
                        `/neworder/${this.props.match.params.place}/${this.props.match.params.id}`
                    }
                >
                    <div className={`items-back`}>
                        <div className={`back-icon`} />
                    </div>
                </Link>
            </div>
            <div
                className={`header second`}
                ref={(div) => (this.categoryButtons = div)}
            >
                {this.props.newOrder.placeMenu.categories.map(
                    (category, categoryIndex) => (
                        <div
                            className={`category-title-wrapper`}
                            ref={(div) =>
                                (this[`category-${categoryIndex}-button`] = div)
                            }
                            onClick={() => {
                                this.props.selectCategory(category.id);
                                animateScrollTo(
                                    this[`category-${categoryIndex}`],
                                    {
                                        verticalOffset: -162,
                                        speed: 600,
                                        minDuration: 100,
                                        maxDuration: 1000,
                                    }
                                );
                            }}
                            key={categoryIndex}
                        >
                            <button
                                className={`category-title ${
                                    this.props.newOrder.selectedCategory.id ===
                                    category.id
                                        ? "active"
                                        : ""
                                }`}
                            >
                                {category.name}
                            </button>
                        </div>
                    )
                )}
            </div>
            {this.props.newOrder.cart.length > 0 && (
                <div className={`footer`}>
                    <Link
                        to={() =>
                            `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/cart`
                        }
                    >
                        <button className={`button`}>
                            Checkout -{" "}
                            {currency(
                                calculateTotal(this.props.newOrder.cart),
                                currencyOptions(this.props.newOrder.currency)
                            ).format()}
                            <div className="cart-count">
                                {calculateTotalAmount(this.props.newOrder.cart)}
                            </div>
                        </button>
                    </Link>
                </div>
            )}
        </div>
    );
    viewItem = () => {
        const generateFooter = () => {
            switch (this.props.contentType) {
                default:
                case "item":
                    return (
                        <div className={`footer`}>
                            <button
                                className={`button`}
                                onClick={() => {
                                    this.props.newOrderAddToCart();
                                    this.props.history.push(
                                        `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/menu`
                                    );
                                }}
                            >
                                Add to cart -{" "}
                                {currency(
                                    calculateItemPrice(
                                        this.props.newOrder.selectedItem,
                                        this.props.newOrder.selectedItem.amount
                                    ),
                                    currencyOptions(
                                        this.props.newOrder.currency
                                    )
                                ).format()}
                                {}
                            </button>
                        </div>
                    );
                case "cart-item":
                    return (
                        <div className={`footer`}>
                            <button
                                className={`button`}
                                onClick={() => {
                                    this.props.newOrderSaveCartItem();
                                    this.props.history.push(
                                        `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/cart`
                                    );
                                }}
                            >
                                Done
                            </button>
                        </div>
                    );
            }
        };
        const renderField = (field) => {
            switch (field.type) {
                case "one":
                    return <OptionSingle key={field.id} field={field} />;
                case "many":
                    return <OptionMany key={field.id} field={field} />;
                default:
                    return null;
            }
        };
        return (
            <div id="view-item">
                <div
                    className={`view-item-body`}
                    ref={(div) => (this.view02body = div)}
                    onScroll={this.handleScrollItems}
                >
                    <Slider {...this.props.newOrder.useSlidesSettings}>
                        {this.props.newOrder.selectedItem.images.map(
                            (image) => (
                                <div key={image.id}>
                                    <div
                                        className={`image`}
                                        style={{
                                            backgroundImage: `url(${image.url})`,
                                        }}
                                    />
                                </div>
                            )
                        )}
                    </Slider>
                    <div className={`item-info`}>
                        <div className={`item-name`}>
                            {this.props.newOrder.selectedItem.name}
                        </div>
                        <div className={`item-description`}>
                            {this.props.newOrder.selectedItem.description}
                        </div>
                    </div>
                    {this.props.newOrder.selectedItem.specialFields.map(
                        (field) => renderField(field)
                    )}
                    <div className={`special-field quantity`}>
                        <div className={`special-field-name`}>Quantity</div>
                        <div className={`special-field-options`}>
                            <div className={`quantity-wrapper`}>
                                <div
                                    className={`quantity-decrease`}
                                    onClick={this.props.newOrderDecreaseAmount}
                                >
                                    -
                                </div>
                                <div className={`quantity-count`}>
                                    {this.props.newOrder.selectedItem.amount}
                                </div>
                                <div
                                    className={`quantity-increase`}
                                    onClick={this.props.newOrderIncreaseAmount}
                                >
                                    +
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`item-total`}>
                        <div className={`item-total-label`}>Total</div>
                        <div className={`item-total-amount`}>
                            {this.props.newOrder.selectedItem.amount} x{" "}
                            {currency(
                                calculateItemPrice(
                                    this.props.newOrder.selectedItem
                                ),
                                currencyOptions(this.props.newOrder.currency)
                            ).format()}{" "}
                            ={" "}
                            {currency(
                                calculateItemPrice(
                                    this.props.newOrder.selectedItem,
                                    this.props.newOrder.selectedItem.amount
                                ),
                                currencyOptions(this.props.newOrder.currency)
                            ).format()}
                        </div>
                    </div>
                </div>
                <div className={`header`}>
                    <Link
                        to={() =>
                            `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/menu`
                        }
                    >
                        <div className={`items-back`}>
                            <div className={`back-icon`} />
                        </div>
                    </Link>
                </div>
                {generateFooter()}
            </div>
        );
    };
    viewCheckout = () => {
        const toggleCheckoutButtons = (e, id) => {
            this.props.newOrderToggleCheckoutButtons(id);
        };
        if (this.props.newOrder.cart.length === 0) {
            return (
                <Redirect
                    to={`/neworder/${this.props.match.params.place}/${this.props.match.params.id}/menu`}
                />
            );
        }
        return (
            <div id={`view-checkout`}>
                <div
                    className={`view-checkout-body`}
                    ref={(div) => (this.view1body = div)}
                    onScroll={this.handleScrollCheckout}
                >
                    <div className={`tap-tip`}>
                        <img src={click} alt={`tap`} />
                        Tap item to edit
                    </div>
                    {renderCheckout(this.props.newOrder).items.map(
                        (item, itemIndex) => (
                            <div
                                key={itemIndex}
                                onClick={(e) =>
                                    toggleCheckoutButtons(e, item.cartId)
                                }
                                className={"cart-item"}
                            >
                                <div className={"cart-item-header"}>
                                    <div className={"cart-item-name"}>
                                        {item.name}
                                    </div>
                                    <div className={"cart-item-price"}>
                                        {item.amount} x{" "}
                                        {currency(
                                            item.price,
                                            currencyOptions(
                                                this.props.newOrder.currency
                                            )
                                        ).format()}
                                    </div>
                                </div>
                                <div className={"cart-item-special-fields"}>
                                    {item.specialFields.map((field) => (
                                        <div
                                            key={field.id}
                                            className={`cart-item-special-field`}
                                        >
                                            <span className={`field-name`}>
                                                {field.name}
                                            </span>
                                            :{" "}
                                            {field.options.map(
                                                (option, optionIndex) => {
                                                    switch (field.type) {
                                                        case "one":
                                                            return option.value ? (
                                                                <span
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                >
                                                                    <span
                                                                        className={`option ${
                                                                            option.value
                                                                                ? "positive"
                                                                                : "negative"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </span>
                                                                </span>
                                                            ) : null;
                                                        case "many":
                                                            return (
                                                                <span
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                >
                                                                    <span
                                                                        className={`option ${
                                                                            option.value
                                                                                ? "positive"
                                                                                : "negative"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            option.name
                                                                        }
                                                                    </span>
                                                                    {optionIndex <
                                                                    field
                                                                        .options
                                                                        .length -
                                                                        1
                                                                        ? ", "
                                                                        : ""}
                                                                </span>
                                                            );
                                                    }
                                                }
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div
                                    className={`buttons-wrapper ${
                                        item.customizable ? "customizable" : ""
                                    } ${
                                        item.cartId ===
                                        this.props.newOrder.checkoutButtons
                                            ? "open"
                                            : ""
                                    }`}
                                >
                                    {item.customizable && (
                                        <button
                                            className={"edit"}
                                            onClick={() => {
                                                this.props.newOrderCustomizeCartItem(
                                                    item.cartId
                                                );
                                                this.props.history.push(
                                                    `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/cart/${item.cartId}`
                                                );
                                            }}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className={"remove"}
                                        onClick={() => {
                                            this.props.newOrderCustomizeCartItem(
                                                item.cartId
                                            );
                                            this.props.newOrderRemoveCartItem();
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                    <div className={`checkout-receipt-summary`}>
                        <div className={`label`}>Total</div>
                        <div className={`total`}>
                            {currency(
                                calculateTotal(this.props.newOrder.cart),
                                currencyOptions(this.props.newOrder.currency)
                            ).format()}
                        </div>
                    </div>
                </div>
                <div className={`header`}>
                    <Link
                        to={() =>
                            `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/menu`
                        }
                    >
                        <div className={`items-back`}>
                            <div className={`back-icon`} />
                        </div>
                    </Link>
                </div>
                <div className={`footer`}>
                    <div>
                        <div className={`label`}>Total</div>
                        <div className={`total`}>
                            {currency(
                                calculateTotal(this.props.newOrder.cart),
                                currencyOptions(this.props.newOrder.currency)
                            ).format()}
                        </div>
                    </div>
                    <div>
                        <Link
                            to={() =>
                                `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/payment`
                            }
                        >
                            <button className={`button`}>
                                {["feature-2", "feature-4"].includes(
                                    this.props.newOrder.pointFeature
                                )
                                    ? "Payment"
                                    : "Place order"}
                            </button>
                        </Link>
                    </div>
                </div>
                <div className={"payment-modal"}>
                    <div className={"payment-modal-inner"}>
                        <div className={"payment-modal-background"}></div>
                        <div className={"payment-modal-body"}>
                            <div className={"total-label"}>Total</div>
                            <div className={"total-amount"}>
                                {currency(
                                    calculateTotal(this.props.newOrder.cart),
                                    currencyOptions(
                                        this.props.newOrder.currency
                                    )
                                ).format()}
                            </div>
                            <Elements stripe={stripe}>
                                <ApplePay />
                            </Elements>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    viewPayment = () => (
        <div id={`view-payment`}>
            <div className={`view-payment-body`}>
                <div
                    className={`amount`}
                    ref={(div) => (this.view2amount = div)}
                >
                    {currency(
                        calculateTotal(this.props.newOrder.cart),
                        currencyOptions(this.props.newOrder.currency)
                    ).format()}
                </div>
                <div className={`payment-buttons`}>
                    <Elements stripe={stripe}>
                        <ApplePay />
                    </Elements>
                    {/* <div
                        className={`payment-button apple`}
                        ref={(div) => (this.view2apple = div)}
                    >
                        <div className={`icon`} />
                    </div>
                    {!this.props.newOrder.isInTestMode ? (
                        <div
                            className={`payment-button p24`}
                            ref={(div) => (this.view2p24 = div)}
                            onClick={this.openP24}
                        >
                            <div className={`icon`} />
                        </div>
                    ) : null}
                    <div
                        className={`payment-button google`}
                        ref={(div) => (this.view2google = div)}
                    >
                        <div className={`icon`} />
                    </div> */}
                    {/* <div
                            className={`payment-button card`}
                            ref={(div) => (this.view2card = div)}
                            onClick={this.open3}
                        >
                            <div className={`icon`} />
                        </div> */}
                    {/* <div
                            className={`payment-button cash`}
                            ref={(div) => (this.view2cash = div)}
                            onClick={this.openCash}
                        >
                            Cash
                        </div> */}
                </div>
            </div>
            <div className={`header`}>
                <Link
                    to={() =>
                        `/neworder/${this.props.match.params.place}/${this.props.match.params.id}/cart`
                    }
                >
                    <div className={`items-back`}>
                        <div className={`back-icon`} />
                    </div>
                </Link>
            </div>
        </div>
    );
    render = () => {
        switch (this.props.contentType) {
            case "menu":
                return this.viewMenu();
            case "cart-item":
            case "item":
                return this.viewItem();
            case "cart":
                return this.viewCheckout();
            case "payment":
                return this.viewPayment();
            case "hi":
            default:
                return this.viewHi();
        }
    };
}
const mapStateToProps = (state) => {
    return {
        newOrder: state.newOrder,
    };
};
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            updateQrData,
            selectCategory,
            selectItem,
            newOrderAddToCart,
            newOrderIncreaseAmount,
            newOrderDecreaseAmount,
            newOrderToggleCheckoutButtons,
            newOrderCustomizeCartItem,
            newOrderSaveCartItem,
            newOrderRemoveCartItem,
        },
        dispatch
    );

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(FreshFeature);
