import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from "axios";
import {
    selectCategory,
    selectItem,
    setView,
    setQrData,
    newOrderAddToCart,
    newOrderToggleCheckoutButtons,
    newOrderCustomizeCartItem,
    newOrderRemoveCartItem,
    newOrderSaveCartItem,
    newOrderProgressChecked,
    newOrderStartPaying,
    newOrderStopPaying,
    newOrderSetErrors,
    newOrderSetFields,
} from "../../../../actions/newOrder";
// import { StripeProvider, Elements } from "react-stripe-elements";
import { ElementsConsumer, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { TimelineLite, Elastic } from "gsap";
import { bodyScrollOff, bodyScrollOn } from "../../../../helpers/listeners";
import logo from "../../../ordeer-logo.svg";
// import { getBrowserData } from '../../../../helpers/statistics';
import { socket } from "../../../../socket";
import { api } from "../../../../api";
import Moment from "react-moment";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import { faStar, faBoxTissue } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import currency from "currency.js";
import Rating from "react-rating";
import click from "../../../click.svg";
import {
    browserName,
    browserVersion,
    mobileVendor,
    mobileModel,
    deviceType,
} from "react-device-detect";
import OptionMany from "./feature-partials/OptionMany";
import OptionSingle from "./feature-partials/OptionSingle";

import PaymentRequestForm from "./feature-partials/PaymentRequestForm";
import SplitFieldsForm from "./feature-partials/SplitFieldsForm";
import CardForm from "./feature-partials/CardForm";
const stripe = loadStripe("pk_test_qHxTXKGEwmRKjMlcVaniPj1100yRvKKPZY");
const AutoplaySlider = withAutoplay(AwesomeSlider);

class Feature2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        };
        this.tl = new TimelineLite();
    }
    componentDidMount = async () => {
        document.addEventListener("click", this.handleDocumentClick);
        const vw = Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
        );
        const vh = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );
        const language =
            window.navigator.userLanguage || window.navigator.language;

        // socket.emit('sessionStart', {
        //     _id: socket.id,
        //     placeId: this.props.newOrder.placeId,
        //     placeName: this.props.newOrder.placeName,
        //     pointId: this.props.newOrder.pointId,
        //     pointName: this.props.newOrder.pointName,
        //     openTime: Date.now(),
        //     viewportWidth: vw,
        //     viewportHeight: vh,
        //     menu: this.props.newOrder.placeMenu,
        //     language,
        //     paid: false,
        //     browserName,
        //     browserVersion,
        //     mobileVendor,
        //     mobileModel,
        //     deviceType,
        //     events: []
        // });

        socket.on("ordersStatusInProgressClient", (data) => {
            if (
                ["feature-3", "feature-4"].includes(
                    this.props.newOrder.pointFeature
                )
            ) {
                this.from501to5();
            } else {
                if (!this.props.newOrder.surveysPassed) {
                    this.from6to5();
                }
            }
        });
        socket.on("ordersStatusReadyClient", (data) => {
            this.props.setQrData({
                closeDate: data.juice.closeDate,
            });

            if (
                ["feature-3", "feature-4"].includes(
                    this.props.newOrder.pointFeature
                )
            ) {
                this.from5to501();
            } else {
                this.from5to6();
            }
        });
        socket.on("closeTestOrder", (data) => {
            this.props.setQrData({
                closeDate: data.juice.closeDate,
            });
            this.from5to6();
        });
        socket.on("ordersStatusClosedClient", (data) => {
            if (
                ["feature-3", "feature-4"].includes(
                    this.props.newOrder.pointFeature
                )
            ) {
                this.from501to6();
            }
        });
    };
    componentWillUnmount = () => {
        document.removeEventListener("click", this.handleDocumentClick);
    };
    calculateTotal = () => {
        let total = 0;
        this.props.newOrder.cart.forEach((item) => {
            total += this.calculateItemPrice(item);
        });
        return Math.round(total * 100) / 100;
    };
    renderCheckout = () => {
        let now = new Date();
        var order = {
            items: [],
            place: this.props.newOrder.placeId,
            point: this.props.newOrder.pointId,
            pointName: this.props.newOrder.pointName,
            layout: this.props.newOrder.layoutId,
            layoutName: this.props.newOrder.layoutName,
            feature: this.props.newOrder.pointFeature,
            total: this.calculateTotal(),
            openDate: now.toISOString(),
            open: true,
            surveysPassed: false,
            paymentRefund: {
                refunded: false,
                refundedBy: "",
                refundDate: "",
            },
            rating: 0,
            review: "",
            _id: this.props.newOrder.sessionId,
        };
        order.items = this.props.newOrder.cart
            .map((item) => ({
                price: this.calculateItemPrice(item),
                name: item.name,
                productId: item.id,
                cartId: item.cartId,
                categoryId: item.categoryId,
                menuId: item.menuId,
                pressed: false,
                customizable: item.specialFields.length > 0,
                specialFields: item.specialFields.map((field) => ({
                    ...field,
                    options: field.options.filter(
                        (option) => option.value !== option.default
                    ),
                })),
            }))
            .map((item) => ({
                ...item,
                specialFields: item.specialFields.filter(
                    (field) => field.options.length > 0
                ),
            }));
        return order;
    };
    handleScrollCategories = (e) => {
        e.preventDefault();
        // socket.emit('sessionEvent', { type: 'categoriesScroll', left: e.target.scrollLeft, timestamp: performance.now() });
    };
    handleScrollItems = (e) => {
        e.preventDefault();
        // socket.emit('sessionEvent', { type: 'itemsScroll', top: e.target.scrollTop, timestamp: performance.now() });
    };
    handleScrollCheckout = (e) => {
        e.preventDefault();
        // socket.emit('sessionEvent', { type: 'checkoutScroll', top: e.target.scrollTop, timestamp: performance.now() });
    };
    handleDocumentClick = (e) => {
        e.preventDefault();
        // socket.emit('sessionEvent', { type: 'click', x: e.pageX, y: e.pageY, timestamp: performance.now() });
    };
    fromHito0 = () => {
        // socket.emit('sessionEvent', { type: 'fromHito0', timestamp: performance.now() });
        this.tl
            .fromTo(this.viewHiImage, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(
                this.viewHiText,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .fromTo(
                this.viewHiButton,
                0.2,
                { y: "0%", opacity: 1 },
                { y: "100%", opacity: 0 },
                "=-0.2"
            )
            .set(this.viewHi, { opacity: 0, "pointer-events": "none" })
            .set(this.view0, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view0body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view0header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view0footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2");
    };
    from0toHi = () => {
        // socket.emit('sessionEvent', { type: 'from0to1', timestamp: performance.now() });
        this.tl
            .fromTo(this.view0header, 0.2, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view0footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view0body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view0, { opacity: 0, "pointer-events": "none" })
            .set(this.viewHi, { opacity: 1, "pointer-events": "all" })
            .fromTo(
                this.viewHiButton,
                0.2,
                { y: "100%", opacity: 0 },
                { y: "0%", opacity: 1 }
            )
            .fromTo(
                this.viewHiText,
                0.2,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.2"
            )
            .fromTo(
                this.viewHiImage,
                0.2,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.2"
            );
    };
    from0to01 = (id) => {
        // socket.emit('sessionEvent', { type: 'from0to01', timestamp: performance.now() });
        this.tl
            .call(() => this.props.selectCategory(id))
            .fromTo(this.view0header, 0.2, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view0footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view0body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view0, { opacity: 0, "pointer-events": "none" })
            .set(this.view01, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view01footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(
                this.view01header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(
                this.view01body,
                0.2,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.2"
            );
    };
    from01to0 = () => {
        // socket.emit('sessionEvent', { type: 'from01to0', timestamp: performance.now() });
        this.tl
            .fromTo(this.view01body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view01footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view01header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .set(this.view01, { opacity: 0, "pointer-events": "none" })
            .set(this.view0, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view0body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view0header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view0footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2");
    };
    from01to02 = (id) => {
        // socket.emit('sessionEvent', { type: 'from01to02', timestamp: performance.now() });
        this.tl
            .call(() => this.props.selectItem(id))
            .fromTo(this.view01body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view01footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view01header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .set(this.view01, { opacity: 0, "pointer-events": "none" })
            .set(this.view02, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view02body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.view02header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(
                this.view02footer,
                0.2,
                { y: "100%" },
                { y: "0%" },
                "=-0.2"
            );
    };
    from02to01 = () => {
        // socket.emit('sessionEvent', { type: 'from02to01', timestamp: performance.now() });
        this.tl
            .fromTo(this.view02header, 0.2, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view02footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view02body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view02, { opacity: 0, "pointer-events": "none" })
            .set(this.view01, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view01footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(
                this.view01header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(
                this.view01body,
                0.2,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.2"
            );
    };
    from02to03 = () => {
        // socket.emit('sessionEvent', { type: 'from02to03', timestamp: performance.now() });
        this.tl
            .fromTo(this.view02header, 0.2, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view02footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view02body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view02, { opacity: 0, "pointer-events": "none" })
            .set(this.view03, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view03footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(
                this.view03header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(
                this.view03body,
                0.2,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.2"
            );
    };
    from03to02 = () => {
        // socket.emit('sessionEvent', { type: 'from03to02', timestamp: performance.now() });
        this.tl
            .fromTo(this.view03body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view03footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view03header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .set(this.view03, { opacity: 0, "pointer-events": "none" })
            .set(this.view02, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view02body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.view02header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(
                this.view02footer,
                0.2,
                { y: "100%" },
                { y: "0%" },
                "=-0.2"
            );
    };
    from03to0 = () => {
        // socket.emit('sessionEvent', { type: 'from03to0', timestamp: performance.now() });
        this.tl
            .call(() => this.props.newOrderAddToCart())
            .fromTo(this.view03body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view03footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view03header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .set(this.view03, { opacity: 0, "pointer-events": "none" })
            .set(this.view0, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view0body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view0header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view0footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2");
    };
    from0to1 = () => {
        // socket.emit('sessionEvent', { type: 'from0to1', timestamp: performance.now() });
        this.tl
            .fromTo(this.view0header, 0.2, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view0footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view0body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view0, { opacity: 0, "pointer-events": "none" })
            .set(this.view1, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view1background, 0.2, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view1footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(this.view1header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view1body, 0.2, { opacity: 0 }, { opacity: 1 });
    };
    from1to0 = () => {
        // socket.emit('sessionEvent', { type: 'from1to0', timestamp: performance.now() });
        this.tl
            .fromTo(this.view1body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view1footer, 0.2, { y: "0%" }, { y: "100%" })
            .fromTo(this.view1header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.2")
            .fromTo(this.view1background, 0.2, { y: "0%" }, { y: "-100%" })
            .set(this.view1, { opacity: 0, "pointer-events": "none" })
            .set(this.view0, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view0body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view0header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view0footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2");
    };
    open101 = (id) => {
        // socket.emit('sessionEvent', { type: 'open101', timestamp: performance.now() });
        this.tl
            .call(() => this.props.newOrderCustomizeCartItem(id))
            .fromTo(this.view101, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view101body, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2")
            .set(this.view101, { opacity: 1, "pointer-events": "all" });
    };
    close101 = (e) => {
        e.stopPropagation();
        if (e.target.id !== "view-101" && e.target.id !== "close-101") {
            return;
        }
        // socket.emit('sessionEvent', { type: 'close101', timestamp: performance.now() });
        this.tl
            .fromTo(this.view101body, 0.3, { y: "0%" }, { y: "100%" })
            .fromTo(this.view101, 0.1, { opacity: 1 }, { opacity: 0 })
            .set(this.view101, { opacity: 0, "pointer-events": "none" });
    };
    handleRemoveCartItem = () => {
        // socket.emit('sessionEvent', { type: 'handleRemoveCartItem', timestamp: performance.now() });
        this.tl
            .call(() => this.props.newOrderRemoveCartItem())
            .set(this.view101, { "pointer-events": "none" })
            .set(this.view1, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view101body, 0.3, { y: "0%" }, { y: "100%" })
            .fromTo(this.view101, 0.1, { opacity: 1 }, { opacity: 0 })
            .set(this.view101, { opacity: 0, "pointer-events": "none" })
            .call(() =>
                this.props.newOrder.cart.length === 0 ? this.from1to0() : null
            );
    };
    from1to2 = () => {
        // socket.emit('sessionEvent', { type: 'from1to2', timestamp: performance.now() });
        this.tl
            .fromTo(this.view1body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view1footer, 0.2, { y: "0%" }, { y: "100%" })
            .fromTo(this.view1header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.2")
            .fromTo(this.view1background, 0.2, { y: "0%" }, { y: "-100%" })
            .set(this.view1, { opacity: 0, "pointer-events": "none" })
            .set(this.view2, { opacity: 1, "pointer-events": "all" })
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
            // .fromTo(this.view2apple, 1, { scale: 0.6, opacity: 0 }, { css: { scale: 1, opacity: 1 }, ease: Elastic.easeOut.config(1, 0.3) }, '=-0.2')
            // .fromTo(this.view2google, 1, { scale: 0.6, opacity: 0 }, { css: { scale: 1, opacity: 1 }, ease: Elastic.easeOut.config(1, 0.3) }, '=-0.9')
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
            );
    };
    from1to4 = () => {
        // socket.emit('sessionEvent', { type: 'from1to2', timestamp: performance.now() });
        this.tl
            .fromTo(this.view1body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view1footer, 0.2, { y: "0%" }, { y: "100%" })
            .fromTo(this.view1header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.2")
            .fromTo(this.view1background, 0.2, { y: "0%" }, { y: "-100%" })
            .set(this.view1, { opacity: 0, "pointer-events": "none" })
            .set(this.view4, { opacity: 1, "pointer-events": "all" })
            .fromTo(
                this.view4loader,
                1,
                { scale: 0 },
                { css: { scale: 1 }, ease: Elastic.easeOut.config(1, 0.3) }
            )
            .call(async () => {
                try {
                    let order = this.renderCheckout();
                    const { data } = await axios.post(
                        `${api}/api/stripe/checkout`,
                        {
                            amount: order.total * 100,
                            placeId: this.props.newOrder.placeId,
                            method: "cash",
                            order,
                        }
                    );
                    this.props.newOrderStopPaying();
                    if (data.success) {
                        this.props.setQrData({
                            openDate: data.updatedOrder.openDate,
                            collectId: data.updatedOrder.collectId,
                        });
                        socket.emit("newOrder", data.updatedOrder);
                        this.handleClick();
                    } else {
                    }
                } catch (err) {
                    console.log(err);
                }
            });
    };
    from2to1 = () => {
        // socket.emit('sessionEvent', { type: 'from2to1', timestamp: performance.now() });
        this.tl
            .fromTo(this.view2amount, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(
                this.view2p24,
                0.1,
                { scale: 1, opacity: 1 },
                { scale: 0.6, opacity: 0 },
                "=-0.2"
            )
            // .fromTo(this.view2apple, 0.1, { scale: 1, opacity: 1 }, { scale: 0.6, opacity: 0 }, '=-0.2')
            // .fromTo(this.view2google, 0.1, { scale: 1, opacity: 1 }, { scale: 0.6, opacity: 0 }, '=-0.05')
            .fromTo(
                this.view2card,
                0.1,
                { scale: 1, opacity: 1 },
                { scale: 0.6, opacity: 0 },
                "=-0.05"
            )
            .fromTo(
                this.view2cash,
                0.1,
                { scale: 1, opacity: 1 },
                { scale: 0.6, opacity: 0 },
                "=-0.05"
            )
            .fromTo(this.view2footer, 0.2, { y: "0%" }, { y: "100%" })
            .fromTo(this.view2header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.2")
            .set(this.view2, { opacity: 0, "pointer-events": "none" })
            .set(this.view1, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view1background, 0.2, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view1footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(this.view1header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view1body, 0.2, { opacity: 0 }, { opacity: 1 });
    };
    open3 = () => {
        // socket.emit('sessionEvent', { type: 'open3', timestamp: performance.now() });
        this.tl
            .fromTo(this.view3, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view3body, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .set(this.view3, { opacity: 1, "pointer-events": "all" });
        // .call(() => {
        //     this.cardNumberInput.select();
        // })
    };
    openP24 = () => {
        // socket.emit('sessionEvent', { type: 'openP24', timestamp: performance.now() });
        this.tl
            .fromTo(this.viewP24, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.viewP24body, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .set(this.viewP24, { opacity: 1, "pointer-events": "all" });
    };
    openCash = () => {
        // socket.emit('sessionEvent', { type: 'openCash', timestamp: performance.now() });
        this.tl
            .fromTo(this.viewCash, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.viewCashBody,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .set(this.viewCash, { opacity: 1, "pointer-events": "all" });
    };
    close3 = (e) => {
        e.stopPropagation();
        if (e.target.id !== "view-3") {
            return;
        }
        // socket.emit('sessionEvent', { type: 'close3', timestamp: performance.now() });
        this.tl
            .fromTo(this.view3body, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view3, 0.1, { opacity: 1 }, { opacity: 0 })
            .set(this.view3, { opacity: 0, "pointer-events": "none" });
    };
    closeP24 = (e) => {
        e.stopPropagation();
        if (e.target.id !== "view-3") {
            return;
        }
        // socket.emit('sessionEvent', { type: 'close3', timestamp: performance.now() });
        this.tl
            .fromTo(this.viewP24body, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(this.viewP24, 0.1, { opacity: 1 }, { opacity: 0 })
            .set(this.viewP24, { opacity: 0, "pointer-events": "none" });
    };
    closeCash = (e) => {
        e.stopPropagation();
        if (e.target.id !== "view-3") {
            return;
        }
        // socket.emit('sessionEvent', { type: 'close3', timestamp: performance.now() });
        this.tl
            .fromTo(this.viewCashBody, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(this.viewCash, 0.1, { opacity: 1 }, { opacity: 0 })
            .set(this.viewCash, { opacity: 0, "pointer-events": "none" });
    };
    from1to102 = (id) => {
        // socket.emit('sessionEvent', { type: 'from1to101', timestamp: performance.now() });
        this.tl
            .call(() => this.props.newOrderCustomizeCartItem(id))
            .fromTo(this.view1body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(this.view1footer, 0.2, { y: "0%" }, { y: "100%" })
            .fromTo(this.view1header, 0.2, { y: "0%" }, { y: "-100%" }, "=-0.2")
            .fromTo(this.view1background, 0.2, { y: "0%" }, { y: "-100%" })
            .set(this.view1, { opacity: 0, "pointer-events": "none" })
            .set(this.view102, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view102body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.view102header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(
                this.view102footer,
                0.2,
                { y: "100%" },
                { y: "0%" },
                "=-0.2"
            );
    };
    from102to1 = () => {
        // socket.emit('sessionEvent', { type: 'from102to1', timestamp: performance.now() });
        this.tl
            .call(() => this.props.newOrderSaveCartItem())
            .fromTo(this.view102body, 0.2, { opacity: 1 }, { opacity: 0 })
            .fromTo(
                this.view102footer,
                0.2,
                { y: "0%" },
                { y: "100%" },
                "=-0.2"
            )
            .fromTo(
                this.view102header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .set(this.view102, { opacity: 0, "pointer-events": "none" })
            .set(this.view1, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view1background, 0.2, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view1footer, 0.2, { y: "100%" }, { y: "0%" })
            .fromTo(this.view1header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view1body, 0.2, { opacity: 0 }, { opacity: 1 });
    };
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };
    handleCardPayment = (cardElement, stripe) => {
        // socket.emit('sessionEvent', { type: 'handleCardPayment', timestamp: performance.now() });
        this.props.newOrderStartPaying();
        this.tl
            .set(this.view3, { "pointer-events": "none" })
            .set(this.view4, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view3body, 0.3, { y: "0%" }, { y: "-100%" })
            .set(this.view3body, { opacity: 0, "pointer-events": "none" })
            .fromTo(
                this.view4loader,
                1,
                { scale: 0 },
                { css: { scale: 1 }, ease: Elastic.easeOut.config(1, 0.3) }
            )
            .call(async () => {
                let order = this.renderCheckout();
                if (this.props.newOrder.isInTestMode) {
                    this.props.setQrData({
                        openDate: Date.now(),
                    });
                    order._id = this.props.newOrder.sessionId;
                    socket.emit("newTestOrder", order);
                    this.handleClick();
                    console.log("done");
                    // this.props.newOrderStopPaying();
                } else {
                    try {
                        const { data } = await axios.post(
                            `${api}/api/stripe/checkout`,
                            {
                                amount: order.total * 100,
                                placeId: this.props.newOrder.placeId,
                                method: "card",
                                order,
                            }
                        );
                        this.props.newOrderStopPaying();
                        if (data.success) {
                            const {
                                paymentIntent,
                                error,
                            } = await stripe.confirmCardPayment(
                                data.intent.client_secret,
                                {
                                    payment_method: { card: cardElement },
                                }
                            );
                            if (error) {
                                console.log("Payment failed!");
                                // Display error.message in your UI.
                            } else {
                                const response = await axios.post(
                                    `${api}/api/stripe/cardSuccess`,
                                    {
                                        sessionId: data.updatedOrder._id,
                                        paymentIntent,
                                    }
                                );
                                if (response.data.success) {
                                    console.log("Paid!");
                                    console.log(response);
                                    this.props.setQrData({
                                        openDate:
                                            response.data.updatedOrder.openDate,
                                        collectId:
                                            response.data.updatedOrder
                                                .collectId,
                                    });
                                    socket.emit(
                                        "newOrder",
                                        response.data.updatedOrder
                                    );
                                    this.handleClick();
                                } else {
                                    console.log(response);
                                }
                            }
                        } else {
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
    };
    initP24Payment = async (stripe) => {
        // socket.emit("sessionEvent", {
        //     type: "handleCardPayment",
        //     timestamp: performance.now(),
        // });
        if (!this.validateEmail(this.props.newOrder.fields.email)) {
            this.props.newOrderSetErrors({ email: "Email is invalid." });
        } else {
            this.props.newOrderStartPaying();
            this.tl
                .set(this.viewP24, { "pointer-events": "none" })
                .set(this.view4, { opacity: 1, "pointer-events": "all" })
                .fromTo(this.viewP24body, 0.3, { y: "0%" }, { y: "-100%" })
                .set(this.viewP24body, {
                    opacity: 0,
                    "pointer-events": "none",
                })
                .fromTo(
                    this.view4loader,
                    1,
                    { scale: 0 },
                    {
                        css: { scale: 1 },
                        ease: Elastic.easeOut.config(1, 0.3),
                    }
                )
                .call(async () => {
                    let order = this.renderCheckout();
                    if (this.props.newOrder.isInTestMode) {
                        this.props.setQrData({
                            openDate: Date.now(),
                        });
                        order._id = this.props.newOrder.sessionId;
                        socket.emit("newTestOrder", order);
                        this.handleClick();
                        this.props.newOrderStopPaying();
                    } else {
                        try {
                            const { data } = await axios.post(
                                `${api}/api/stripe/checkout`,
                                {
                                    amount: order.total * 100,
                                    placeId: this.props.newOrder.placeId,
                                    method: "p24",
                                    order,
                                }
                            );

                            this.props.newOrderStopPaying();
                            if (data.success) {
                                this.props.setQrData({
                                    openDate: data.updatedOrder.openDate,
                                    collectId: data.updatedOrder.collectId,
                                });
                                const {
                                    error,
                                } = await stripe.confirmP24Payment(
                                    data.intent.client_secret,
                                    {
                                        payment_method: {
                                            billing_details: {
                                                email: this.props.newOrder
                                                    .fields.email,
                                            },
                                        },
                                        return_url: `http://localhost:3000/p24token/${data.updatedOrder._id}`,
                                    }
                                );

                                if (error) {
                                    console.log(error);
                                    // Inform the customer that there was an error.
                                }
                                // this.handleClick();
                            } else {
                                console.log(data);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
        }
    };
    handleCashPayment = (token) => {
        // socket.emit('sessionEvent', { type: 'handleCardPayment', timestamp: performance.now() });
        this.props.newOrderStartPaying();
        this.tl
            .set(this.viewCash, { "pointer-events": "none" })
            .set(this.view4, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.viewCashBody, 0.3, { y: "0%" }, { y: "-100%" })
            .set(this.viewCashBody, { opacity: 0, "pointer-events": "none" })
            .fromTo(
                this.view4loader,
                1,
                { scale: 0 },
                { css: { scale: 1 }, ease: Elastic.easeOut.config(1, 0.3) }
            )
            .call(async () => {
                let order = this.renderCheckout();
                if (this.props.newOrder.isInTestMode) {
                    this.props.setQrData({
                        openDate: Date.now(),
                    });
                    order._id = this.props.newOrder.sessionId;
                    socket.emit("newTestOrder", order);
                    this.handleClick();
                    this.props.newOrderStopPaying();
                } else {
                    try {
                        const { data } = await axios.post(
                            `${api}/api/stripe/checkout`,
                            {
                                amount: order.total * 100,
                                placeId: this.props.newOrder.placeId,
                                method: "cash",
                                order,
                            }
                        );
                        this.props.newOrderStopPaying();
                        if (data.success) {
                            this.props.setQrData({
                                openDate: data.updatedOrder.openDate,
                                collectId: data.updatedOrder.collectId,
                            });
                            socket.emit("newOrder", data.updatedOrder);
                            this.handleClick();
                        } else {
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            });
    };
    handleClick = () => {
        // socket.emit('sessionPayment', { type: 'paymentSuccess', success: true, timestamp: performance.now() });
        this.tl
            .fromTo(
                this.view4loader,
                0.6,
                { scale: 1 },
                { css: { scale: 0 }, ease: Elastic.easeIn.config(1, 0.3) }
            )
            .set(this.view5, { opacity: 1, "pointer-events": "all", x: "100%" })
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
            .set(this.view2, { opacity: 0, "pointer-events": "none" })
            .set(this.view3, { opacity: 0, "pointer-events": "none" })
            .set(this.view4, { opacity: 0, "pointer-events": "none" });
    };
    from5to501 = () => {
        this.tl
            .call(() => {
                this.props.newOrderProgressChecked(true);
            })
            .fromTo(this.view5header, 0.3, { y: "0%" }, { y: "-100%" }, "+=1")
            .fromTo(this.view5footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view501, { opacity: 1, "pointer-events": "all" })
            .set(this.view5, { opacity: 0, "pointer-events": "none" })
            .fromTo(this.view501header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(
                this.view501footer,
                0.3,
                { y: "100%" },
                { y: "0%" },
                "=-0.3"
            )
            .fromTo(
                this.view501body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            );
    };
    from5to6 = () => {
        this.tl
            .call(() => {
                this.props.newOrderProgressChecked(true);
            })
            .fromTo(this.view5header, 0.3, { y: "0%" }, { y: "-100%" }, "+=1")
            .fromTo(this.view5footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view6, { opacity: 1, "pointer-events": "all" })
            .set(this.view5, { opacity: 0, "pointer-events": "none" })
            .fromTo(this.view6header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view6footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view6body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            );
    };
    from501to5 = () => {
        this.tl
            .call(() => {
                this.props.newOrderProgressChecked(false);
            })
            .fromTo(this.view501header, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(
                this.view501footer,
                0.3,
                { y: "0%" },
                { y: "100%" },
                "=-0.3"
            )
            .fromTo(
                this.view501body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view5, { opacity: 1, "pointer-events": "all" })
            .set(this.view501, { opacity: 0, "pointer-events": "none" })
            .fromTo(this.view5header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view5footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            );
    };
    from6to5 = () => {
        this.tl
            .call(() => {
                this.props.newOrderProgressChecked(false);
            })
            .set(this.view6, { "pointer-events": "none" })
            .fromTo(this.view6header, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view6footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view6body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view6, { opacity: 0 })
            .set(this.view5, { opacity: 1, "pointer-events": "all" })
            .fromTo(this.view5header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view5footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            );
    };
    from501to6 = () => {
        this.tl
            .fromTo(this.view501header, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(
                this.view501footer,
                0.3,
                { y: "0%" },
                { y: "100%" },
                "=-0.3"
            )
            .fromTo(
                this.view501body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view6, { opacity: 1, "pointer-events": "all" })
            .set(this.view501, { opacity: 0, "pointer-events": "none" })
            .fromTo(this.view6header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view6footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view6body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            );
    };
    from6to7 = () => {
        this.tl
            .call(() => {
                if (this.props.newOrder.isInTestMode) {
                    socket.emit("newTestOrderRating", {
                        id: this.props.newOrder.sessionId,
                        place: this.props.newOrder.placeId,
                        rating: this.props.newOrder.rating,
                        review: this.props.newOrder.review,
                    });
                } else {
                    socket.emit("newOrderRating", {
                        id: this.props.newOrder.sessionId,
                        rating: this.props.newOrder.rating,
                        review: this.props.newOrder.review,
                    });
                }
            })
            .set(this.view6, { "pointer-events": "none" })
            .fromTo(this.view6header, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view6footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view6body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .fromTo(this.view7, 0.3, { opacity: 0 }, { opacity: 1 })
            .set(this.view7, { opacity: 1, "pointer-events": "all" })
            .set(this.view6, { opacity: 0, "pointer-events": "none" })
            .fromTo(this.view7header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view7footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view7body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            );
    };
    calculateItemPrice = (item) => {
        let price = parseFloat(item.price);
        item.specialFields.forEach((field) => {
            field.options.forEach((option) => {
                if (option.value !== option.default) {
                    if (option.default) {
                        price -= parseFloat(option.priceImpact);
                    } else {
                        price += parseFloat(option.priceImpact);
                    }
                }
            });
        });
        return Math.round(price * 100) / 100;
    };
    toggleCheckoutButtons = (e, id) => {
        // if (e.target.id === '') {
        //     return
        // }
        this.props.newOrderToggleCheckoutButtons(id);
    };
    renderField = (field) => {
        switch (field.type) {
            case "one":
                return <OptionSingle key={field.id} field={field} />;
            case "many":
                return <OptionMany key={field.id} field={field} />;
            default:
                return null;
        }
    };
    renderContent = () => {
        switch (this.props.newOrder.pointFeature) {
            case "feature-1":
                switch (true) {
                    case this.props.newOrder.surveysPassed:
                        return this.HTMLview7(1);
                    case this.props.newOrder.exists &&
                        !this.props.newOrder.open:
                        return (
                            <>
                                {this.HTMLview6(1)}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5()}
                                {this.HTMLview6(1)}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        !this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5(1)}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                    default:
                        return (
                            <>
                                {this.HTMLviewHi(1)}
                                {this.HTMLview0()}
                                {this.HTMLview01()}
                                {this.HTMLview02()}
                                {this.HTMLview03()}
                                {this.HTMLview1()}
                                {this.HTMLview101()}
                                {this.HTMLview102()}
                                {/* Confirm making order */}
                                {this.HTMLview4()}
                                {this.HTMLview5()}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                }
            case "feature-2":
                switch (true) {
                    case this.props.newOrder.surveysPassed:
                        return this.HTMLview7(1);
                    case this.props.newOrder.exists &&
                        !this.props.newOrder.open:
                        return (
                            <>
                                {this.HTMLview6(1)}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5()}
                                {this.HTMLview6(1)}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        !this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5(1)}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                    default:
                        return (
                            <>
                                {this.HTMLviewHi(1)}
                                {this.HTMLview0()}
                                {this.HTMLview01()}
                                {this.HTMLview02()}
                                {this.HTMLview03()}
                                {this.HTMLview1()}
                                {this.HTMLview101()}
                                {this.HTMLview102()}
                                {this.HTMLview2()}
                                {this.HTMLview3()}
                                {this.HTMLviewP24()}
                                {this.HTMLviewCash()}
                                {this.HTMLview4()}
                                {this.HTMLview5()}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                }
            case "feature-3":
                switch (true) {
                    case this.props.newOrder.surveysPassed:
                        return this.HTMLview7(1);
                    case this.props.newOrder.exists &&
                        !this.props.newOrder.open:
                        return (
                            <>
                                {this.HTMLview6(1)}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5()}
                                {this.HTMLview501(1)}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        !this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5(1)}
                                {this.HTMLview501()}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                    default:
                        return (
                            <>
                                {this.HTMLviewHi(1)}
                                {this.HTMLview0()}
                                {this.HTMLview01()}
                                {this.HTMLview02()}
                                {this.HTMLview03()}
                                {this.HTMLview1()}
                                {this.HTMLview101()}
                                {this.HTMLview102()}
                                {/* Confirm order here */}
                                {this.HTMLview4()}
                                {this.HTMLview5()}
                                {this.HTMLview501()}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                }
            case "feature-4":
                switch (true) {
                    case this.props.newOrder.surveysPassed:
                        return this.HTMLview7(1);
                    case this.props.newOrder.exists &&
                        !this.props.newOrder.open:
                        return (
                            <>
                                {this.HTMLview6(1)}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5()}
                                {this.HTMLview501(1)}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                    case this.props.newOrder.exists &&
                        this.props.newOrder.open &&
                        !this.props.newOrder.ready:
                        return (
                            <>
                                {this.HTMLview5(1)}
                                {this.HTMLview501()}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                    default:
                        return (
                            <>
                                {this.HTMLviewHi(1)}
                                {this.HTMLview0()}
                                {this.HTMLview01()}
                                {this.HTMLview02()}
                                {this.HTMLview03()}
                                {this.HTMLview1()}
                                {this.HTMLview101()}
                                {this.HTMLview102()}
                                {this.HTMLview2()}
                                {this.HTMLview3()}
                                {this.HTMLviewP24()}
                                {this.HTMLviewCash()}
                                {this.HTMLview4()}
                                {this.HTMLview5()}
                                {this.HTMLview501()}
                                {this.HTMLview6()}
                                {this.HTMLview7()}
                            </>
                        );
                }
        }
    };
    HTMLviewHi = (start) => (
        <div
            id="view-hi"
            className={start ? "start" : ""}
            ref={(div) => (this.viewHi = div)}
        >
            <div
                className={`view-hi-image`}
                ref={(div) => (this.viewHiImage = div)}
            >
                {this.props.newOrder.placeMenu.images.map((image) => (
                    <div
                        key={image.id}
                        className={"image-wrapper"}
                        style={{ backgroundImage: `url(${image.url})` }}
                    />
                ))}
            </div>
            <div
                className={`view-hi-footer`}
                ref={(div) => (this.viewHiFooter = div)}
            >
                <div ref={(div) => (this.viewHiText = div)}>
                    <div className={`welcome`}>Welcome to</div>
                    <div className={`place-name`}>
                        {this.props.newOrder.placeName}
                    </div>
                </div>
                <div ref={(div) => (this.viewHiButton = div)}>
                    <button className={`start-button`} onClick={this.fromHito0}>
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
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
                <div className={`categories-back`} onClick={this.from0toHi}>
                    <div className={`back-icon`} />
                </div>
                <div className={`categories-title`}>Categories</div>
            </div>
            <div
                className={`view-0-body`}
                ref={(div) => (this.view0body = div)}
                onScroll={this.handleScrollItems}
            >
                {this.props.newOrder.placeMenu.categories.map(
                    (category, categoryIndex) => (
                        <div
                            key={categoryIndex}
                            className={`menu-list-category`}
                            onClick={() => this.from0to01(category.id)}
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
                    <div ref={(div) => (this.view0total = div)}>
                        {this.calculateTotal()} zł
                    </div>
                </div>
                <div>
                    {this.props.newOrder.cart.length > 0 && (
                        <button
                            className={`payment-button`}
                            onClick={this.from0to1}
                        >
                            Checkout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    HTMLview01 = (start) => (
        <div
            id="view-01"
            className={start ? "start" : ""}
            ref={(div) => (this.view01 = div)}
        >
            <div
                className={`view-01-header`}
                ref={(div) => (this.view01header = div)}
            >
                <div className={`items-back`} onClick={this.from01to0}>
                    <div className={`back-icon`} />
                </div>
                <div className={`items-title`}>
                    {this.props.newOrder.selectedCategory.name}
                </div>
            </div>
            <div
                className={`view-01-body`}
                ref={(div) => (this.view01body = div)}
                onScroll={this.handleScrollItems}
            >
                {this.props.newOrder.selectedCategory.items.map(
                    (item, itemIndex) => (
                        <div
                            key={itemIndex}
                            className={`menu-list-item ${
                                item.available ? "" : "unavailable"
                            }`}
                            onClick={() => this.from01to02(item.id)}
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
                                <div className={`item-name`}>{item.name}</div>
                                <div className={`item-price`}>
                                    {item.price} zł
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
            <div
                className={`view-01-footer`}
                ref={(div) => (this.view01footer = div)}
            >
                <div>
                    <div className={`label`}>Total</div>
                    <div>{this.calculateTotal()} zł</div>
                </div>
                <div>
                    {this.props.newOrder.cart.length > 0 && (
                        <button
                            className={`payment-button`}
                            onClick={this.from0to1}
                        >
                            Checkout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    HTMLview02 = (start) => (
        <div
            id="view-02"
            className={start ? "start" : ""}
            ref={(div) => (this.view02 = div)}
        >
            <div
                className={`view-02-header`}
                ref={(div) => (this.view02header = div)}
            >
                <div className={`items-back`} onClick={this.from02to01}>
                    <div className={`back-icon`} />
                </div>
            </div>
            <div
                className={`view-02-body`}
                ref={(div) => (this.view02body = div)}
                onScroll={this.handleScrollItems}
            >
                <div className={`shadow`} />
                <AutoplaySlider
                    play={true}
                    cancelOnInteraction={true} // should stop playing on user interaction
                    interval={4000}
                >
                    {this.props.newOrder.selectedItem.images.map((image) => (
                        <div
                            key={image.id}
                            className={`image`}
                            style={{ backgroundImage: `url(${image.url})` }}
                        />
                    ))}
                </AutoplaySlider>
                <div className={`item-info`}>
                    <div className={`item-name`}>
                        {this.props.newOrder.selectedItem.name}
                    </div>
                    <div className={`item-price`}>
                        {this.props.newOrder.selectedItem.price} zł
                    </div>
                    <div className={`item-description`}>
                        {this.props.newOrder.selectedItem.description}
                    </div>
                </div>
            </div>
            <div
                className={`view-02-footer`}
                ref={(div) => (this.view02footer = div)}
            >
                <button className={`payment-button`} onClick={this.from02to03}>
                    Customize and add to cart
                </button>
            </div>
        </div>
    );

    HTMLview03 = (start) => (
        <div
            id="view-03"
            className={start ? "start" : ""}
            ref={(div) => (this.view03 = div)}
        >
            <div
                className={`view-03-header`}
                ref={(div) => (this.view03header = div)}
            >
                <div className={`item-back`} onClick={this.from03to02}>
                    <div className={`back-icon`} />
                </div>
                <div className={`item-title`}>Customize</div>
                <div className={`item-price`}>
                    {this.calculateItemPrice(this.props.newOrder.selectedItem)}{" "}
                    zł
                </div>
            </div>
            <div
                className={`view-03-body`}
                ref={(div) => (this.view03body = div)}
                onScroll={this.handleScrollItems}
            >
                {this.props.newOrder.selectedItem.specialFields.map((field) =>
                    this.renderField(field)
                )}
            </div>
            <div
                className={`view-03-footer`}
                ref={(div) => (this.view03footer = div)}
            >
                <button className={`payment-button`} onClick={this.from03to0}>
                    Add to cart
                </button>
            </div>
        </div>
    );

    HTMLview1 = (start) => (
        <div
            id={`view-1`}
            className={start ? "start" : ""}
            ref={(div) => (this.view1 = div)}
        >
            <div
                className={`view-1-background`}
                ref={(div) => (this.view1background = div)}
            ></div>
            <div className={`view-1-content`}>
                <div
                    className={`view-1-header`}
                    ref={(div) => (this.view1header = div)}
                >
                    <div className={`checkout-back`} onClick={this.from1to0}>
                        <div className={`back-icon`} />
                    </div>
                    <div className={`checkout-title`}>Checkout</div>
                </div>
                <div
                    className={`view-1-body`}
                    ref={(div) => (this.view1body = div)}
                    onScroll={this.handleScrollCheckout}
                >
                    <div className={`checkout-receipt`}>
                        <div className={`tap-tip`}>
                            <img src={click} alt={`tap`} />
                            Tap item to edit
                        </div>
                        {this.renderCheckout().items.map((item, itemIndex) => (
                            <div
                                key={itemIndex}
                                onClick={(e) =>
                                    this.toggleCheckoutButtons(e, item.cartId)
                                }
                                className={"cart-item"}
                            >
                                <div className={"cart-item-header"}>
                                    <div className={"cart-item-name"}>
                                        {item.name}
                                    </div>
                                    <div className={"cart-item-price"}>
                                        {item.price}
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
                                            onClick={() =>
                                                this.from1to102(item.cartId)
                                            }
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className={"remove"}
                                        onClick={() =>
                                            this.open101(item.cartId)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className={`checkout-receipt-summary`}>
                            <div className={`label`}>Total</div>
                            <div className={`total`}>
                                {this.calculateTotal()} zł
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={`view-1-footer`}
                    ref={(div) => (this.view1footer = div)}
                >
                    <div>
                        <div className={`label`}>Total</div>
                        <div>{this.calculateTotal()} zł</div>
                    </div>
                    <div>
                        <button
                            className={`payment-button`}
                            onClick={
                                ["feature-2", "feature-4"].includes(
                                    this.props.newOrder.pointFeature
                                )
                                    ? this.from1to2
                                    : this.from1to4
                            }
                        >
                            {["feature-2", "feature-4"].includes(
                                this.props.newOrder.pointFeature
                            )
                                ? "Payment"
                                : "Place order"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    HTMLview101 = (start) => (
        <div
            id="view-101"
            className={start ? "start" : ""}
            ref={(div) => (this.view101 = div)}
            onClick={this.close101}
        >
            <div
                className={`view-101-body`}
                ref={(div) => (this.view101body = div)}
            >
                <div className={`info`}>
                    Are you sure you want to remove the item from the cart?
                </div>
                <button
                    className={`cancel`}
                    id="close-101"
                    onClick={this.close101}
                >
                    Cancel
                </button>
                <button
                    className={`remove`}
                    onClick={this.handleRemoveCartItem}
                >
                    Remove
                </button>
            </div>
        </div>
    );

    HTMLview102 = (start) => (
        <div
            id="view-102"
            className={start ? "start" : ""}
            ref={(div) => (this.view102 = div)}
        >
            <div
                className={`view-03-header`}
                ref={(div) => (this.view102header = div)}
            >
                {/* <div className={`item-back`}
                        onClick={this.from03to02}
                    >
                        <div className={`back-icon`} />
                    </div> */}
                <div className={`item-title full`}>Customize</div>
                <div className={`item-price`}>
                    {this.calculateItemPrice(this.props.newOrder.selectedItem)}{" "}
                    zł
                </div>
            </div>
            <div
                className={`view-03-body`}
                ref={(div) => (this.view102body = div)}
                onScroll={this.handleScrollItems}
            >
                {this.props.newOrder.selectedItem.specialFields.map((field) =>
                    this.renderField(field)
                )}
            </div>
            <div
                className={`view-03-footer`}
                ref={(div) => (this.view102footer = div)}
            >
                <button className={`payment-button`} onClick={this.from102to1}>
                    Done
                </button>
            </div>
        </div>
    );

    HTMLview2 = (start) => (
        <div
            id={`view-2`}
            className={start ? "start" : ""}
            ref={(div) => (this.view2 = div)}
        >
            <div className={`view-2-content`}>
                <div
                    className={`view-2-header`}
                    ref={(div) => (this.view2header = div)}
                >
                    <div className={`checkout-back`} onClick={this.from2to1}>
                        <div className={`back-icon`} />
                    </div>
                    <div className={`checkout-title`}>Payment</div>
                </div>
                <div className={`view-2-body`}>
                    <div
                        className={`amount`}
                        ref={(div) => (this.view2amount = div)}
                    >
                        {this.calculateTotal()} zł
                    </div>
                    <div className={`payment-buttons`}>
                        {/* <div className={`payment-button apple`} ref={div => this.view2apple = div}><div className={`icon`} /></div> */}
                        {!this.props.newOrder.isInTestMode ? (
                            <div
                                className={`payment-button p24`}
                                ref={(div) => (this.view2p24 = div)}
                                onClick={this.openP24}
                            >
                                <div className={`icon`} />
                            </div>
                        ) : (
                            null
                        )}
                        {/* <div className={`payment-button google`} ref={div => this.view2google = div}><div className={`icon`} /></div> */}
                        <div
                            className={`payment-button card`}
                            ref={(div) => (this.view2card = div)}
                            onClick={this.open3}
                        >
                            <div className={`icon`} />
                        </div>
                        <div
                            className={`payment-button cash`}
                            ref={(div) => (this.view2cash = div)}
                            onClick={this.openCash}
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
                        <div>{this.calculateTotal()} zł</div>
                    </div>
                </div>
            </div>
        </div>
    );
    HTMLview3 = (start) => (
        <div
            id="view-3"
            className={start ? "start" : ""}
            ref={(div) => (this.view3 = div)}
            onClick={this.close3}
        >
            <div
                className={`view-3-body`}
                ref={(div) => (this.view3body = div)}
            >
                {this.props.newOrder.isInTestMode ? (
                    <>
                        <label>
                            Card number
                            <div
                                className={`input`}
                                ref={(div) => (this.cardNumberInput = div)}
                            >
                                0000 0000 0000 0000
                            </div>
                        </label>
                        <div className={`expiry-ccv`}>
                            <label>
                                Expiry
                                <div
                                    className={`input`}
                                    ref={(div) => (this.expiryInput = div)}
                                >
                                    00/00
                                </div>
                            </label>
                            <label>
                                CVC
                                <div
                                    className={`input`}
                                    ref={(div) => (this.cvcInput = div)}
                                >
                                    000
                                </div>
                            </label>
                        </div>
                        <button
                            className={`pay`}
                            onClick={this.handleCardPayment}
                        >
                            Pay
                        </button>
                    </>
                ) : (
                    <Elements stripe={stripe}>
                        <ElementsConsumer>
                            {({ elements, stripe }) => (
                                <CardForm
                                    elements={elements}
                                    stripe={stripe}
                                    handleResult={this.handleCardPayment}
                                    setErrors={this.props.newOrderSetErrors}
                                    startPaying={this.props.newOrderStartPaying}
                                    stopPaying={this.props.newOrderStopPaying}
                                    payingStatus={this.props.newOrder.paying}
                                    errors={this.props.newOrder.errors}
                                    buttonText={"Pay"}
                                    loadingText={`Processing payment...`}
                                />
                            )}
                        </ElementsConsumer>
                    </Elements>
                )}
            </div>
        </div>
    );
    HTMLviewP24 = (start) => (
        <div
            id="view-3"
            className={start ? "start" : ""}
            ref={(div) => (this.viewP24 = div)}
            onClick={this.closeP24}
        >
            <div
                className={`view-3-body`}
                ref={(div) => (this.viewP24body = div)}
            >
                {/* {this.props.newOrder.isInTestMode ? (
                    <form
                        onSubmit={() =>
                            this.props.newOrder.paying
                                ? null
                                : this.initP24Payment(stripe)
                        }
                    >
                        <div className="split-form">
                            <label>
                                Email address
                                <input type="email" readOnly value={`user@example.com`} />
                            </label>
                        </div>
                        {this.props.newOrder.paying ? (
                            <button className={`pay`}>
                                Processing payment...
                            </button>
                        ) : (
                            <input
                                type={"submit"}
                                className={`pay`}
                                onClick={() =>
                                    this.props.newOrder.paying
                                        ? null
                                        : this.handleCardPayment()
                                }
                                value={`Pay`}
                            />
                        )}
                    </form>
                ) : ( */}
                <Elements stripe={stripe}>
                    <ElementsConsumer>
                        {({ elements, stripe }) => (
                            <form
                                onSubmit={() =>
                                    this.props.newOrder.paying
                                        ? null
                                        : this.initP24Payment(stripe)
                                }
                            >
                                <div className="split-form">
                                    <label>
                                        Email address
                                        <input
                                            type="email"
                                            onChange={(e) =>
                                                this.props.newOrderSetFields({
                                                    email: e.target.value,
                                                })
                                            }
                                        />
                                    </label>
                                </div>
                                <div className="error" role="alert">
                                    {this.props.newOrder.errors.email}
                                </div>
                                {this.props.newOrder.paying ? (
                                    <button className={`pay`}>
                                        Processing payment...
                                    </button>
                                ) : (
                                    <input
                                        type={"submit"}
                                        className={`pay`}
                                        onClick={() =>
                                            this.props.newOrder.paying
                                                ? null
                                                : this.initP24Payment(stripe)
                                        }
                                        value={`Pay`}
                                    />
                                )}
                            </form>
                        )}
                    </ElementsConsumer>
                </Elements>
            </div>
        </div>
    );
    HTMLviewCash = (start) => (
        <div
            id="view-3"
            className={start ? "start" : ""}
            ref={(div) => (this.viewCash = div)}
            onClick={this.closeCash}
        >
            <div
                className={`view-3-body`}
                ref={(div) => (this.viewCashBody = div)}
            >
                <div className={`cash-info`}>
                    Prepare cash to pay for your order.
                </div>
                {this.props.newOrder.paying ? (
                    <button className={`pay`}>Processing payment...</button>
                ) : (
                    <input
                        type={"submit"}
                        className={`pay`}
                        onClick={
                            this.props.newOrder.paying
                                ? null
                                : this.handleCashPayment
                        }
                        value={`Pay`}
                    />
                )}
            </div>
        </div>
    );
    HTMLview4 = (start) => (
        <div
            id="view-4"
            className={start ? "start" : ""}
            ref={(div) => (this.view4 = div)}
        >
            <div
                className={`loader-wrapper`}
                ref={(div) => (this.view4loader = div)}
            >
                <div
                    className={`loader ${
                        this.state.clicked ? "load-complete" : ""
                    }`}
                >
                    <div className="circle-loader">
                        <div className="checkmark"></div>
                        <div className="errormark"></div>
                    </div>
                </div>
            </div>
        </div>
    );
    HTMLview5 = (start) => (
        <div
            id="view-5"
            className={start ? "start" : ""}
            ref={(div) => (this.view5 = div)}
        >
            <div
                className={`view-5-header`}
                ref={(div) => (this.view5header = div)}
            >
                Thanks for your order!
            </div>
            <div
                className={`view-5-body`}
                ref={(div) => (this.view5body = div)}
            >
                {/* <div
                    className={`loader ${
                        this.props.newOrder.progressChecked
                            ? "load-complete"
                            : ""
                    }`}
                >
                    <div className="circle-loader">
                        <div className="checkmark"></div>
                        <div className="errormark"></div>
                    </div>
                </div> */}
                <div className={`content`}>
                    <div className={`title`}>Waiting time</div>
                    <div className={`value`}>
                        <Moment
                            duration={this.props.newOrder.openDate}
                            date={this.props.now}
                        />
                    </div>
                    <div className={`title`}>Pickup code</div>
                    <div className={`value`}>
                        {this.props.newOrder.collectId}
                    </div>
                </div>
            </div>
            <div
                className={`view-5-footer`}
                ref={(div) => (this.view5footer = div)}
            >
                Please wait. We will notify you when your order is ready to
                collect.
            </div>
        </div>
    );
    HTMLview501 = (start) => (
        <div
            id="view-501"
            className={start ? "start" : ""}
            ref={(div) => (this.view501 = div)}
        >
            <div
                className={`view-501-header`}
                ref={(div) => (this.view501header = div)}
            >
                Order is ready to collect!
            </div>
            <div
                className={`view-501-body`}
                ref={(div) => (this.view501body = div)}
            >
                <div className={`loader load-complete`}>
                    <div className="circle-loader">
                        <div className="checkmark"></div>
                    </div>
                </div>
                <div className={`content`}>
                    <div className={`title`}>Pickup code</div>
                    <div className={`value`}>
                        {this.props.newOrder.collectId}
                    </div>
                </div>
            </div>
            <div
                className={`view-501-footer`}
                ref={(div) => (this.view501footer = div)}
            >
                Show this screen in the counter
            </div>
        </div>
    );
    HTMLview6 = (start) => (
        <div
            id="view-6"
            className={start ? "start" : ""}
            ref={(div) => (this.view6 = div)}
        >
            <div
                className={`view-6-header`}
                ref={(div) => (this.view6header = div)}
            >
                All done!
            </div>
            <div
                className={`view-6-body`}
                ref={(div) => (this.view6body = div)}
            >
                <textarea
                    onChange={(e) =>
                        this.props.setQrData({ review: e.target.value })
                    }
                    value={this.props.newOrder.review}
                    placeholder="Share with us your opinion"
                    maxLength="300"
                />
                <div className="rating">
                    <Rating
                        initialRating={this.props.newOrder.rating}
                        onChange={(rate) =>
                            this.props.setQrData({ rating: rate })
                        }
                        emptySymbol={
                            <span className={`star empty`}>
                                <FontAwesomeIcon size={"lg"} icon={faStar} />
                            </span>
                        }
                        fullSymbol={
                            <span className={`star full`}>
                                <FontAwesomeIcon size={"lg"} icon={faStar} />
                            </span>
                        }
                    />
                </div>
            </div>
            <div
                className={`view-6-footer`}
                ref={(div) => (this.view6footer = div)}
            >
                <button className={`share-button`} onClick={this.from6to7}>
                    Share
                </button>
            </div>
        </div>
    );
    HTMLview7 = (start) => (
        <div
            id="view-7"
            className={start ? "start" : ""}
            ref={(div) => (this.view7 = div)}
        >
            <div
                className={`view-7-header`}
                ref={(div) => (this.view7header = div)}
            >
                See you soon!
            </div>
            <div
                className={`view-7-body`}
                ref={(div) => (this.view7body = div)}
            >
                <div className={`content`}>
                    <div className={`logo`}>
                        <img src={logo} />
                    </div>
                    <div className={`title`}>Order date</div>
                    <div className={`value`}>
                        <Moment format="MMMM Do YYYY">
                            {this.props.newOrder.openDate}
                        </Moment>
                    </div>
                    <div className={`title`}>Realization time</div>
                    <div className={`value`}>
                        <Moment
                            date={this.props.newOrder.closeDate}
                            duration={this.props.newOrder.openDate}
                        />
                    </div>
                    <div className={`value`}>
                        <Rating
                            initialRating={this.props.newOrder.rating}
                            readonly
                            emptySymbol={
                                <span className={`star empty`}>
                                    <FontAwesomeIcon
                                        size={"lg"}
                                        icon={faStar}
                                    />
                                </span>
                            }
                            fullSymbol={
                                <span className={`star full`}>
                                    <FontAwesomeIcon
                                        size={"lg"}
                                        icon={faStar}
                                    />
                                </span>
                            }
                        />
                    </div>
                </div>
            </div>
            <div
                className={`view-7-footer`}
                ref={(div) => (this.view7footer = div)}
            ></div>
        </div>
    );
    render = () => {
        return (
            <>
                {this.renderContent()}
                {this.props.newOrder.isInTestMode && (
                    <div id={`test-mode-frame`}>
                        <div className={`test-mode-text`}>Test mode</div>
                    </div>
                )}
            </>
        );
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
            selectCategory,
            selectItem,
            setView,
            newOrderAddToCart,
            newOrderToggleCheckoutButtons,
            newOrderCustomizeCartItem,
            newOrderRemoveCartItem,
            newOrderSaveCartItem,
            newOrderProgressChecked,
            setQrData,
            newOrderStartPaying,
            newOrderStopPaying,
            newOrderSetErrors,
            newOrderSetFields,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Feature2);
