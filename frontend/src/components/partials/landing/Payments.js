import React from "react";
import { connect } from "react-redux";
import "react-awesome-slider/dist/styles.css";
import { TimelineMax, gsap, Elastic } from "gsap";
import TextPlugin from "gsap/TextPlugin";
import click from "../../click.svg";
class Payments extends React.Component {
    constructor(props) {
        super(props);
        this.tl = new TimelineMax({ repeat: -1 });
    }
    componentDidMount = () => {
        gsap.registerPlugin(TextPlugin);
        this.from0to1();
    };
    componentWilUnmount() {}
    HTMLview0 = (start) => (
        <div
            id="view-0"
            className={start ? "start" : ""}
            ref={(div) => (this.view0 = div)}
        >
            <div
                className={`view-0-header`}
                ref={(div) => (this.view0header = div)}
            >
                <div className={`categories-back`}>
                    <div className={`back-icon`} />
                </div>
                <div className={`categories-title`}>Categories</div>
            </div>
            <div
                className={`view-0-body`}
                ref={(div) => (this.view0body = div)}
            >
                {this.props.landing.examples.customizations.categories.map(
                    (category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className={`menu-list-category`}
                        >
                            <div className={`category-name`}>
                                {category.name}
                            </div>
                            <div className={`category-image`}>
                                <div className={`image-wrapper`}>
                                    {category.images.map((image) => (
                                        <div
                                            key={image.id}
                                            className={`image`}
                                            style={{
                                                backgroundImage: `url(${image.url})`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
            <div
                className={`view-0-footer`}
                ref={(div) => (this.view0footer = div)}
            >
                <div>
                    <div className={`label`}>Total</div>
                    <div ref={(div) => (this.view0total = div)}>12.90 €</div>
                </div>
                <div>
                    <button className={`payment-button`}>Checkout</button>
                </div>
            </div>
        </div>
    );
    HTMLview1 = (start) => (
        <div id={`view-1`} ref={(div) => (this.view1 = div)}>
            <div
                className={`view-1-background`}
                ref={(div) => (this.view1background = div)}
            ></div>
            <div className={`view-1-content`}>
                <div
                    className={`view-1-header`}
                    ref={(div) => (this.view1header = div)}
                >
                    <div className={`checkout-back`}>
                        <div className={`back-icon`} />
                    </div>
                    <div className={`checkout-title`}>Checkout</div>
                </div>
                <div
                    className={`view-1-body`}
                    ref={(div) => (this.view1body = div)}
                >
                    <div className={`checkout-receipt`}>
                        <div className={`tap-tip`}>
                            <img src={click} alt={`tap`} />
                            Tap item to edit
                        </div>
                        <div className="cart-item">
                            <div className="cart-item-header">
                                <div className="cart-item-name">Neapolitana</div>
                                <div className="cart-item-price">12.9</div>
                            </div>
                            <div className="cart-item-special-fields">
                                <div className="cart-item-special-field">
                                    <span className="field-name">Crust</span>:{" "}
                                    <span>
                                        <span className="option positive">
                                            Thick
                                        </span>
                                    </span>
                                </div>
                                <div className="cart-item-special-field">
                                    <span className="field-name">Add ons</span>:{" "}
                                    <span>
                                        <span className="option negative">
                                            Bacon
                                        </span>
                                        ,{" "}
                                    </span>
                                    <span>
                                        <span className="option positive">
                                            Olives
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="buttons-wrapper customizable ">
                                <button className="edit">Edit</button>
                                <button className="remove">Remove</button>
                            </div>
                        </div>
                        <div className={`checkout-receipt-summary`}>
                            <div className={`label`}>Total</div>
                            <div className={`total`}>12.90 €</div>
                        </div>
                    </div>
                </div>
                <div
                    className={`view-1-footer`}
                    ref={(div) => (this.view1footer = div)}
                >
                    <div>
                        <div className={`label`}>Total</div>
                        <div>12.90 €</div>
                    </div>
                    <div>
                        <button className={`payment-button`}>Payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
    HTMLview2 = (start) => (
        <div id={`view-2`} ref={(div) => (this.view2 = div)}>
            <div className={`view-2-content`}>
                <div
                    className={`view-2-header`}
                    ref={(div) => (this.view2header = div)}
                >
                    <div className={`checkout-back`}>
                        <div className={`back-icon`} />
                    </div>
                    <div className={`checkout-title`}>Payment</div>
                </div>
                <div className={`view-2-body`}>
                    <div
                        className={`amount`}
                        ref={(div) => (this.view2amount = div)}
                    >
                        12.90 €
                    </div>
                    <div className={`payment-buttons`}>
                        <div
                            className={`payment-button p24`}
                            ref={(div) => (this.view2p24 = div)}
                        >
                            <div className={`icon`} />
                        </div>

                        <div
                            className={`payment-button card`}
                            ref={(div) => (this.view2card = div)}
                        >
                            <div className={`icon`} />
                        </div>
                        <div
                            className={`payment-button cash`}
                            ref={(div) => (this.view2cash = div)}
                        >
                            Cash
                        </div>
                    </div>
                </div>
                <div
                    className={`view-2-footer`}
                    ref={(div) => (this.view2footer = div)}
                >
                    <div>
                        <div className={`label`}>Total</div>
                        <div>12.90 €</div>
                    </div>
                </div>
            </div>
        </div>
    );
    HTMLview3 = (start) => (
        <div id="view-3" ref={(div) => (this.view3 = div)}>
            <div
                className={`view-3-body`}
                ref={(div) => (this.view3body = div)}
            >
                <label>
                    Card number
                    <div
                        className={`input`}
                        ref={(div) => (this.cardNumberInput = div)}
                    />
                </label>
                <div className={`expiry-ccv`}>
                    <label>
                        Expiry
                        <div
                            className={`input`}
                            ref={(div) => (this.expiryInput = div)}
                        />
                    </label>
                    <label>
                        CVC
                        <div
                            className={`input`}
                            ref={(div) => (this.cvcInput = div)}
                        />
                    </label>
                </div>
                <button className={`pay`}>Pay</button>
            </div>
        </div>
    );
    HTMLview4 = (start) => (
        <div id="view-4" ref={(div) => (this.view4 = div)}>
            <div
                className={`loader-wrapper`}
                ref={(div) => (this.view4loader = div)}
            >
                <div className={`loader`}>
                    <div className="circle-loader">
                        <div className="checkmark"></div>
                        <div className="errormark"></div>
                    </div>
                </div>
            </div>
        </div>
    );
    HTMLview5 = (start) => (
        <div id="view-5" ref={(div) => (this.view5 = div)}>
            <div
                className={`view-5-header`}
                ref={(div) => (this.view5header = div)}
            >
                Your order is in progress!
            </div>
            <div
                className={`view-5-body`}
                ref={(div) => (this.view5body = div)}
            >
                <div className={`content`}>
                    <div className={`title`}>Waiting time</div>
                    <div className={`value`}>
                        0:34
                    </div>
                    <div className={`title`}>Pickup code</div>
                    <div className={`value`}>QATE</div>
                </div>
            </div>
            <div
                className={`view-5-footer`}
                ref={(div) => (this.view5footer = div)}
            >
            Please wait. We will notify you when your order is ready to collect.
            </div>
        </div>
    );
    from0to1 = (id) => {
        this.tl
            //from0to1
            .set(this.cursor, { opacity: 0, top: "327px", left: "157px" })
            .fromTo(this.cursor, 0.1, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.cursor,
                0.8,
                { top: "327px", left: "157px" },
                { top: "687px", left: "287px", delay: 1 }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(this.view0header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.1")
            .fromTo(this.view0footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view0body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view0, { opacity: 0})
            .set(this.view1, { opacity: 1})
            .fromTo(this.view1background, 0.2, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view1footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(this.view1header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view1body, 0.2, { opacity: 0 }, { opacity: 1 })
            // from1to2
            .fromTo(
                this.cursor,
                0.2,
                { top: "687px", left: "287px" },
                { top: "680px", left: "270px", delay: 1 }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(this.view1body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view1footer, 0.2, { y: "0%" }, { y: "100%" })
            .fromTo(this.view1header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.2")
            .fromTo(this.view1background, 0.2, { y: "0%" }, { y: "-100%" })
            .set(this.view1, { opacity: 0})
            .set(this.view2, { opacity: 1})
            .fromTo(this.view2footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(this.view2header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view2amount, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.view2p24,
                1,
                { scale: 0.6, opacity: 0 },
                {
                    css: { scale: 1, opacity: 1 },
                    ease: Elastic.easeOut.config(1, 0.3),
                },
                "=-0.2"
            )
            .fromTo(
                this.view2card,
                1,
                { scale: 0.6, opacity: 0 },
                {
                    css: { scale: 1, opacity: 1 },
                    ease: Elastic.easeOut.config(1, 0.3),
                },
                "=-0.9"
            )
            .fromTo(
                this.view2cash,
                1,
                { scale: 0.6, opacity: 0 },
                {
                    css: { scale: 1, opacity: 1 },
                    ease: Elastic.easeOut.config(1, 0.3),
                },
                "=-0.9"
            )
            // open3
            .fromTo(
                this.cursor,
                0.5,
                { top: "680px", left: "270px" },
                { top: "380px", left: "180px" }, "=-0.9"
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(this.view3, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view3body, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .set(this.view3, { opacity: 1 })
            //handleCardPayment
            .fromTo(
                this.cursor,
                0.8,
                { top: "380px", left: "180px" },
                { top: "60px", left: "160px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .to(this.cardNumberInput, {
                duration: 2,
                text: { value: "4242 4242 4242 4242", delimiter: "" },
                ease: "none",
            })
            .fromTo(
                this.cursor,
                0.2,
                { top: "60px", left: "160px" },
                { top: "130px", left: "60px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .to(this.expiryInput, { duration: 0.6, text: "12/23", ease: "none" })
            .fromTo(
                this.cursor,
                0.4,
                { top: "130px", left: "60px" },
                { top: "140px", left: "260px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .to(this.cvcInput, { duration: 0.5, text: "123", ease: "none" })
            .fromTo(
                this.cursor,
                0.3,
                { top: "140px", left: "260px" },
                { top: "210px", left: "180px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .set(this.view4, { opacity: 1})
            .fromTo(this.view3body, 0.3, { y: "0%" }, { y: "-100%" }, "=-0.1")
            .set(this.view3body, { opacity: 0 })
            .fromTo(
                this.view4loader,
                1,
                { scale: 0 },
                { css: { scale: 1 }, ease: Elastic.easeOut.config(1, 0.3) }
            )
            //handleClick
            .fromTo(
                this.view4loader,
                0.6,
                { scale: 1 },
                {
                    css: { scale: 0 },
                    ease: Elastic.easeIn.config(1, 0.3),
                    delay: 1,
                }
            )
            .set(this.view5, { opacity: 1, x: "100%" })
            .fromTo(this.view5, 0.3, { x: "100%" }, { x: "0%" })
            .fromTo(this.view5header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view5footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            )
            .set(this.view2, { opacity: 0})
            .set(this.view3, { opacity: 0 })
            .set(this.view4, { opacity: 0 })
            .fromTo(this.cursor, 0.1, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view5, 0.5, { opacity: 1 }, { opacity: 0, delay: 2 })
            .set(this.view0, { opacity: 1})
            .fromTo(this.view0body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view0header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view0footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2");
        
    };
    render = () => {
        return (
            <div id="example">
                {this.HTMLview0(1)}
                {this.HTMLview1()}
                {this.HTMLview2()}
                {this.HTMLview3()}
                {this.HTMLview4()}
                {this.HTMLview5()}
                <div className={`cursor`} ref={(div) => (this.cursor = div)}>
                    <div className={`cursor-border`} />
                </div>
            </div>
        );
    };
}
const mapStateToProps = (state) => ({
    landing: state.landing,
});
const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(Payments);
