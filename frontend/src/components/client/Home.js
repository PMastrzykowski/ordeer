import React from "react";
import {
    Link,
    withRouter,
} from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser, loginSetManagerData } from "../../actions/login";
import {
    landingPreviousSlide,
    landingNextSlide,
    landingAddOrder,
    landingCloseOrder,
    landingOrderRating,
    landingToggleMenu,
    landingReset,
    landingSetIp,
} from "../../actions/landing";
import Rating from "react-rating";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "../../api";
import { socket } from "../../socket";
import mainBackgroundLogo from "../main-background-logo.svg";
import mainPhone from "../main-phone.png";
import "react-awesome-slider/dist/styles.css";
import { TimelineMax } from "gsap";
import axios from "axios";
import { QRCode } from "react-qr-svg";
import animateScrollTo from "animated-scroll-to";
import paymentsVideo from "../partials/payments.mov";
import customizationsVideo from "../partials/customizations.mov";
import reviewsVideo from "../partials/reviews.mov";
import Slider from "react-slick";
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.tl = new TimelineMax({});
        this.scrollOptions = {
            horizontalOffset: -100,

            // Maximum duration of the scroll animation
            maxDuration: 500,

            // Minimum duration of the scroll animation
            minDuration: 200,

            // Duration of the scroll per 1000px
            speed: 500,

            // Vertical scroll offset
            // Practical when you are scrolling to a DOM element and want to add some padding
            verticalOffset: -100,
        };
    }
    componentDidMount = () => {
        // socket.emit("join", socket.id);
        this.props.landingReset();
        // this.nextSlide();
        this.scrollOptions = {
            ...this.scrollOptions,
            elementToScroll: document.getElementById("root"),
        };
        socket.on("connect", () => {
            axios
                .get(`${api}/api/users/clientip`)
                .then((res) => {
                    this.props.landingSetIp(res.data.ip);
                    socket.emit("join", res.data.ip);
                })
                .catch((err) => {});
        });
        socket.on("newTestOrder", (data) => {
            if (data.source !== socket.id) {
                this.props.landingAddOrder(data.juice);
                animateScrollTo(this.section5InnerLeft, this.scrollOptions);
                // this.audio.play();
                // new Notification('New order', { body: `New order from `, icon });
            }
        });
        socket.on("newTestOrderRating", (data) => {
            if (data.source !== socket.id) {
                this.props.landingOrderRating(data.juice);
                animateScrollTo(this.section5InnerLeft, this.scrollOptions);
            }
        });
    };
    componentWilUnmount() {}
    closeOrder = (data) => {
        let now = new Date();
        data.closeDate = now.toISOString();
        this.props.landingCloseOrder(data);
        socket.emit("closeTestOrder", data);
    };
    render = () => {
        return (
            <div id="landing">
                <div className={`cookies-info`}>
                    This website uses cookies to provide the best services. If
                    you keep using the website or click this message you agree
                    for their use.
                </div>
                <div
                    className={`landing-content`}
                    ref={(div) => (this.landingContent = div)}
                >
                    <nav className={`navbar`}>
                        <div className={`left-side`}>
                            <div className={"main-logo"} />
                        </div>
                        <div
                            className={`right-side ${
                                this.props.landing.isMenuOpen ? "open" : ""
                            }`}
                        >
                            <div className={`right-side-inner`}>
                                <button className={`transparent`}>Plans</button>
                                <Link to={"/login"}>
                                    <button className={`transparent`}>
                                        Log in
                                    </button>
                                </Link>
                                <Link to={"/register"}>
                                    <button className={`try`}>
                                        Try now for free
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className={`right-side-mobile`}>
                            <div
                                className={`hamburger-menu`}
                                onClick={() => this.props.landingToggleMenu()}
                            >
                                <div className={`bar`} />
                                <div className={`bar`} />
                            </div>
                        </div>
                    </nav>
                    <div id="section-0">
                        <div className={`section-0-background`}></div>
                        <div className={`section-0-logo-floating`}>
                            <img
                                src={mainBackgroundLogo}
                                alt="Background logo"
                            />
                        </div>
                        <div className={`section-0-content`}>
                            <div className={`section-0-content-left`}>
                                <h1>Excellent QR Menu experience</h1>
                                <h2>
                                    Sell more, reduce waiters’ work, cut
                                    expenses!
                                </h2>
                                <div>
                                    <button className={`try`}>
                                        Try now for free
                                    </button>
                                </div>
                                <div className={`main-tomatoe-yellow`} />
                                <div className={`main-tomatoe-red`} />
                                <div className={`main-rocket-1`} />
                            </div>
                            <div className={`section-0-content-right`}>
                                <img src={mainPhone} alt="Background logo" />
                                <div className={`main-rocket-2`} />
                            </div>
                        </div>
                    </div>
                    <div id="section-1">
                        <div className={`section-1-content`}>
                            <h1>Ordeers QR Menu</h1>
                            <h2>
                                Safe and elegant way for better customer service
                            </h2>
                            <p>
                                Share your products and collect orders by your
                                customers’ devices. Reduce staff work and let
                                your clients for self service.
                            </p>
                            <p>
                                Ordeers QR Menus work in mobile browsers, NO app
                                installation is required!
                            </p>
                            <div className={`no-apps`}>
                                <div className={`no-appstore`} />
                                <div className={`no-googleplay`} />
                            </div>
                        </div>
                    </div>
                    <div id="section-2" ref={(div) => (this.section2 = div)}>
                        <div className={`section-2-title`}>
                            So convenient in
                        </div>
                        <Slider {...this.props.landing.useSlidesSettings}>
                            {this.props.landing.useSlides.map((box, i) => (
                                <div key={`box-${i}`} className={`slider-box`}>
                                    <div
                                        key={`box-${i}`}
                                        className={`slider-box-content`}
                                    >
                                        <div className={`slider-title`}>
                                            {box.title}
                                        </div>
                                        <div className={`slider-description`}>
                                            <p>{box.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div id="section-3" ref={(div) => (this.section3 = div)}>
                        <h1>How does it work?</h1>
                        <div className={`instruction`}>
                            <div className={`step-1 step`}>
                                <div className={`title`}>
                                    <div className={`number`}>1</div>
                                    <div className={`caption`}>
                                        Scan the code
                                    </div>
                                </div>
                                <div className={`icon`} />
                            </div>
                            <div className={`step-2 step`}>
                                <div className={`icon`} />
                                <div className={`title`}>
                                    <div className={`number`}>2</div>
                                    <div className={`caption`}>
                                        Make an order
                                    </div>
                                </div>
                            </div>
                            <div className={`step-3 step`}>
                                <div className={`title`}>
                                    <div className={`number`}>3</div>
                                    <div className={`caption`}>
                                        Enjoy your meal
                                    </div>
                                </div>
                                <div className={`icon`} />
                            </div>
                        </div>
                    </div>
                    <div id="section-4" ref={(div) => (this.section4 = div)}>
                        <div className={`section-4-title`}>
                            Some sample features
                        </div>
                        <div className={`features`}>
                            <div className={`feature-1 feature`}>
                                <div className={`title`}>Customizations</div>
                                <div className={`example`}>
                                    <div className={`skin-shadow`}>
                                        <div className={`screen-inner`}>
                                            <video
                                                src={customizationsVideo}
                                                autoPlay
                                                playsInline
                                                muted
                                                loop
                                            />
                                        </div>
                                        <div className={`skin`} />
                                    </div>
                                </div>
                            </div>
                            <div className={`feature-2 feature`}>
                                <div className={`title`}>Payments</div>
                                <div className={`example`}>
                                    <div className={`skin-shadow`}>
                                        <div className={`screen-inner`}>
                                            <video
                                                src={paymentsVideo}
                                                autoPlay
                                                playsInline
                                                muted
                                                loop
                                            />
                                        </div>
                                        <div className={`skin`} />
                                    </div>
                                </div>
                            </div>
                            <div className={`feature-3 feature`}>
                                <div className={`title`}>Reviews</div>
                                <div className={`example`}>
                                    <div className={`skin-shadow`}>
                                        <div className={`screen-inner`}>
                                            <video
                                                src={reviewsVideo}
                                                autoPlay
                                                playsInline
                                                muted
                                                loop
                                            />
                                        </div>
                                        <div className={`skin`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="section-5" ref={(div) => (this.section5 = div)}>
                        <div className={`section-5-inner`}>
                            <div
                                className={`section-5-inner-left`}
                                ref={(div) => (this.section5InnerLeft = div)}
                            >
                                {this.props.landing.sample.orders.length > 0 ? (
                                    this.props.landing.sample.orders.map(
                                        (order, i) => (
                                            <div key={i} className={`order`}>
                                                <div className={`order-header`}>
                                                    <div
                                                        className={`order-header-left`}
                                                    >
                                                        3 min ago
                                                    </div>
                                                    <div
                                                        className={`order-header-right`}
                                                    >
                                                        <button
                                                            className={`close-order`}
                                                            onClick={() =>
                                                                order.open
                                                                    ? this.closeOrder(
                                                                          {
                                                                              _id:
                                                                                  order._id,
                                                                              place: this
                                                                                  .props
                                                                                  .landing
                                                                                  .ip,
                                                                          }
                                                                      )
                                                                    : null
                                                            }
                                                        >
                                                            Close order
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={`order-body`}>
                                                    {order.items.map(
                                                        (item, i) => (
                                                            <div
                                                                key={i}
                                                                className={`order-item`}
                                                            >
                                                                <div
                                                                    className={`order-item-header`}
                                                                >
                                                                    <div
                                                                        className={`order-item-header-left`}
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={`order-item-header-right`}
                                                                    >
                                                                        {
                                                                            item.price
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={`special-fields`}
                                                                >
                                                                    {item.specialFields.map(
                                                                        (
                                                                            field,
                                                                            i
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className={`special-field`}
                                                                            >
                                                                                <div
                                                                                    className={`special-field-label`}
                                                                                >
                                                                                    {
                                                                                        field.name
                                                                                    }
                                                                                </div>
                                                                                <div
                                                                                    className={`special-field-options`}
                                                                                >
                                                                                    {field.options
                                                                                        .filter(
                                                                                            (
                                                                                                option
                                                                                            ) =>
                                                                                                (field.type ===
                                                                                                    "one" &&
                                                                                                    option.value) ||
                                                                                                field.type !==
                                                                                                    "one"
                                                                                        )
                                                                                        .map(
                                                                                            (
                                                                                                option,
                                                                                                i
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        i
                                                                                                    }
                                                                                                    className={`special-field-option ${
                                                                                                        option.value
                                                                                                            ? "positive"
                                                                                                            : "negative"
                                                                                                    }`}
                                                                                                >
                                                                                                    {
                                                                                                        option.name
                                                                                                    }
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <div className={`order-footer`}>
                                                    <div
                                                        className={`order-footer-top`}
                                                    >
                                                        Total
                                                    </div>
                                                    <div
                                                        className={`order-footer-bottom`}
                                                    >
                                                        {order.total}{" "}
                                                        <span
                                                            className={`currency`}
                                                        >
                                                            PLN
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className={`order-closed ${
                                                        !order.open
                                                            ? "visible"
                                                            : ""
                                                    }`}
                                                >
                                                    <div
                                                        className={`instruction ${
                                                            !order.surveysPassed
                                                                ? "visible"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`review-invitation-icon`}
                                                        />
                                                        Now you can use your
                                                        mobile phone to send a
                                                        review
                                                    </div>
                                                    <div
                                                        className={`review ${
                                                            order.surveysPassed
                                                                ? "visible"
                                                                : ""
                                                        }`}
                                                    >
                                                        <div
                                                            className={`rating`}
                                                        >
                                                            <Rating
                                                                initialRating={
                                                                    order.rating
                                                                }
                                                                readonly
                                                                emptySymbol={
                                                                    <span
                                                                        className={`star empty`}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            size={
                                                                                "lg"
                                                                            }
                                                                            icon={
                                                                                faStar
                                                                            }
                                                                        />
                                                                    </span>
                                                                }
                                                                fullSymbol={
                                                                    <span
                                                                        className={`star full`}
                                                                    >
                                                                        <FontAwesomeIcon
                                                                            size={
                                                                                "lg"
                                                                            }
                                                                            icon={
                                                                                faStar
                                                                            }
                                                                        />
                                                                    </span>
                                                                }
                                                            />
                                                        </div>
                                                        <div
                                                            className={`review-text`}
                                                        >
                                                            "{order.review}"
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className={"no-orders-frame"}>
                                        <div className={"no-orders-icon"} />
                                        <div className={"no-orders-text"}>
                                            Your orders will appear here.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={`section-5-inner-right`}>
                                <h1>Try it out!</h1>
                                <h2>
                                    Scan the code with your smartphone camera
                                    and see your orders appearing on the left
                                    side
                                </h2>
                                <div className={`qr-wrapper`}>
                                    {typeof socket !== "undefined" ? (
                                        <QRCode
                                            bgColor="none"
                                            fgColor="inherit"
                                            level="Q"
                                            // style={{ width: 50 }}
                                            value={`${
                                                process.env.NODE_ENV ===
                                                "production"
                                                    ? "https://qrspots.herokuapp.com"
                                                    : "http://192.168.0.24:3000"
                                            }/qr/test--${
                                                this.props.landing.ip
                                            }`}
                                            id={`svg-qr`}
                                        />
                                    ) : (
                                        <div>Loading...</div>
                                    )}
                                    <div className={`arrow`} />
                                </div>
                                <div className={`or`}>Or</div>
                                <div className={`qr-link-buttons`}>
                                    {typeof socket !== "undefined" ? (
                                            <button onClick={()=> {
                                                window.open(`${
                                                            process.env.NODE_ENV ===
                                                            "production"
                                                                ? "https://qrspots.herokuapp.com"
                                                                : "http://localhost:3000"
                                                        }/qr/test--${
                                                            this.props.landing.ip
                                                        }`,'_blank').focus()
                                            }}>Open in a new tab</button>
                                    ) : (
                                        <div>Loading...</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="section-6" ref={(div) => (this.section6 = div)}>
                        <div className={`section-6-title`}>Our plans</div>
                        <div className={`plans`}>
                            <Slider {...this.props.landing.plansSlidesSettings}>
                                {this.props.landing.plansSlides.map(
                                    (plan, i) => (
                                        <div className={`plan-wrapper`} key={i}>
                                            <div className={`plan`}>
                                                <div className={`plan-header`}>
                                                    <div
                                                        className={`plan-header-title`}
                                                    >
                                                        {plan.name}
                                                    </div>
                                                    <div
                                                        className={`plan-header-price`}
                                                    >
                                                        {plan.price}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`plan-body`}
                                                ></div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </Slider>
                        </div>
                    </div>
                    <div id="section-7" ref={(div) => (this.section7 = div)}>
                        <div className={`section-7-title`}>
                            Get in touch with us!
                        </div>
                        <div className={`section-7-contact-form`}>
                            <form>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder={`Email`}
                                />
                                <textarea
                                    id="message"
                                    placeholder={`Message`}
                                />
                                <button id={"submit"}>Send</button>
                            </form>
                        </div>
                    </div>
                    <footer>
                        <div className={`footer-body`}>
                            <div className={`logo`} />
                            <ul>
                                <li
                                    onClick={() =>
                                        // console.log(this.scrollOptions)
                                        animateScrollTo(
                                            this.section2,
                                            this.scrollOptions
                                        )
                                    }
                                >
                                    Where to use it?
                                </li>
                                <li
                                    onClick={() =>
                                        animateScrollTo(
                                            this.section3,
                                            this.scrollOptions
                                        )
                                    }
                                >
                                    How does it work?
                                </li>
                                <li
                                    onClick={() =>
                                        animateScrollTo(
                                            this.section4,
                                            this.scrollOptions
                                        )
                                    }
                                >
                                    Features
                                </li>
                                <li
                                    onClick={() =>
                                        animateScrollTo(
                                            this.section5,
                                            this.scrollOptions
                                        )
                                    }
                                >
                                    Demo
                                </li>
                                <li
                                    onClick={() =>
                                        animateScrollTo(
                                            this.section6,
                                            this.scrollOptions
                                        )
                                    }
                                >
                                    Plans
                                </li>
                                <li
                                    onClick={() =>
                                        animateScrollTo(
                                            this.section7,
                                            this.scrollOptions
                                        )
                                    }
                                >
                                    Get in touch
                                </li>
                            </ul>
                        </div>
                    </footer>
                </div>
            </div>
        );
    };
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    landing: state.landing,
});
const mapDispatchToProps = {
    loginSetManagerData,
    logoutUser,
    landingPreviousSlide,
    landingNextSlide,
    landingAddOrder,
    landingCloseOrder,
    landingOrderRating,
    landingToggleMenu,
    landingReset,
    landingSetIp,
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home));
