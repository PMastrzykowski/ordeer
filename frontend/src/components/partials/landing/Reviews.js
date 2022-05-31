import React from "react";
import { connect } from "react-redux";
import "react-awesome-slider/dist/styles.css";
import { TimelineMax, gsap } from "gsap";
import TextPlugin from "gsap/TextPlugin";
import {
    landingExampleReviews,
    landingExampleReviewsReset,
} from "../../../actions/landing";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../ordeer-logo.svg";
import Rating from "react-rating";
import Moment from "react-moment";
class Reviews extends React.Component {
    constructor(props) {
        super(props);
        this.tl = new TimelineMax({ repeat: -1 });
    }
    componentDidMount = () => {
        gsap.registerPlugin(TextPlugin);
        this.from0to1();
    };
    componentWilUnmount() {}
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

    HTMLview501 = (start) => (
        <div id="view-501" ref={(div) => (this.view501 = div)}>
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
                    <div className={`value`}>QATE</div>
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
        <div id="view-6" ref={(div) => (this.view6 = div)}>
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
                    placeholder="Share with us your opinion"
                    ref={(div) => (this.reviewInput = div)}
                    maxLength="300"
                />
                <div className="rating">
                    <Rating
                        initialRating={this.props.landing.examples.reviews.rating}
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
        <div id="view-7" ref={(div) => (this.view7 = div)}>
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
                        <img src={logo} alt={'logo'} />
                    </div>
                    <div className={`title`}>Order date</div>
                    <div className={`value`}>
                        <Moment format="MMMM Do YYYY">{Date.now()}</Moment>
                    </div>
                    <div className={`title`}>Realization time</div>
                    <div className={`value`}>11:25</div>
                    <div className={`value`}>
                        <Rating
                            initialRating={5}
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
    from0to1 = (id) => {
        this.tl
            //from5to501
            .set(this.cursor, { opacity: 0, scale: 1 })
            .fromTo(this.view5header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view5footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            )
            .fromTo(
                this.view5header,
                0.3,
                { y: "0%" },
                { y: "-100%", delay: 2 }
            )
            .fromTo(this.view5footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view5body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view501, { opacity: 1 })
            .set(this.view5, { opacity: 0 })
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
            )
            //from501to6
            .fromTo(
                this.view501header,
                0.3,
                { y: "0%" },
                { y: "-100%", delay: 1 }
            )
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
            .set(this.view6, { opacity: 1 })
            .set(this.view501, { opacity: 0 })
            .fromTo(this.view6header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view6footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view6body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            )
            //from6to7
            .set(this.cursor, { opacity: 0, top: "327px", left: "157px" })
            .fromTo(this.cursor, 0.1, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.cursor,
                0.3,
                { top: "327px", left: "157px" },
                { top: "240px", left: "70px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .to(this.reviewInput, {
                duration: 2,
                text: {
                    value: "Great food and amazing experience!",
                    delimiter: "",
                },
                ease: "none",
            })
            .fromTo(
                this.cursor,
                0.6,
                { top: "240px", left: "70px" },
                { top: "450px", left: "260px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .call(() => this.props.landingExampleReviews())
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.7,
                { top: "450px", left: "260px" },
                { top: "650px", left: "157px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(this.view6header, 0.3, { y: "0%" }, { y: "-100%" })
            .fromTo(this.view6footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view6body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .set(this.view7, { opacity: 1 })
            .set(this.view6, { opacity: 0})
            .fromTo(this.view7header, 0.3, { y: "-100%" }, { y: "0%" })
            .fromTo(this.view7footer, 0.3, { y: "100%" }, { y: "0%" }, "=-0.3")
            .fromTo(
                this.view7body,
                0.3,
                { opacity: 0 },
                { opacity: 1 },
                "=-0.3"
            )
            .fromTo(this.cursor, 0.1, { opacity: 1 }, { opacity: 0 })
            //from7to5
            .fromTo(
                this.view7header,
                0.3,
                { y: "0%" },
                { y: "-100%", delay: 2 }
            )
            .fromTo(this.view7footer, 0.3, { y: "0%" }, { y: "100%" }, "=-0.3")
            .fromTo(
                this.view7body,
                0.3,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.3"
            )
            .call(() => this.props.landingExampleReviewsReset());
    };
    render = () => {
        return (
            <div id="example">
                {this.HTMLview5(1)}
                {this.HTMLview501()}
                {this.HTMLview6()}
                {this.HTMLview7()}
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
    landingExampleReviews,
    landingExampleReviewsReset,
};
export default connect(mapStateToProps, mapDispatchToProps)(Reviews);
