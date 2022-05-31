import React from "react";
import { connect } from "react-redux";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css";
import { TimelineMax, gsap } from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

import OptionMany from "../../client/new_order/features/feature-partials/OptionMany";
import OptionSingle from "../../client/new_order/features/feature-partials/OptionSingle";
import {
    landingExampleCustomizations1,
    landingExampleCustomizations2,
    landingExampleCustomizations3,
    landingExampleCustomizationsReset,
} from "../../../actions/landing";
const AutoplaySlider = withAutoplay(AwesomeSlider);
class Customizations extends React.Component {
    constructor(props) {
        super(props);
        this.tl = new TimelineMax({ repeat: -1 });
    }
    componentDidMount = () => {
        gsap.registerPlugin(ScrollToPlugin);
        this.from0to01();
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
                    <div ref={(div) => (this.view0total = div)}>0.00 €</div>
                </div>
                <div></div>
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
                <div className={`items-back`}>
                    <div className={`back-icon`} />
                </div>
                <div className={`items-title`}>
                    {
                        this.props.landing.examples.customizations
                            .selectedCategory.name
                    }
                </div>
            </div>
            <div
                className={`view-01-body`}
                ref={(div) => (this.view01body = div)}
            >
                {this.props.landing.examples.customizations.selectedCategory.items.map(
                    (item, itemIndex) => (
                        <div
                            key={itemIndex}
                            className={`menu-list-item ${
                                item.available ? "" : "unavailable"
                            }`}
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
                                    {item.price} €
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
                    <div>0 €</div>
                </div>
                <div></div>
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
                <div className={`items-back`}>
                    <div className={`back-icon`} />
                </div>
            </div>
            <div
                className={`view-02-body`}
                ref={(div) => (this.view02body = div)}
            >
                <div className={`shadow`} />
                <AutoplaySlider
                    play={true}
                    cancelOnInteraction={true} // should stop playing on user interaction
                    interval={4000}
                >
                    {this.props.landing.examples.customizations.selectedItem.images.map(
                        (image) => (
                            <div
                                key={image.id}
                                className={`image`}
                                style={{ backgroundImage: `url(${image.url})` }}
                            />
                        )
                    )}
                </AutoplaySlider>
                <div className={`item-info`}>
                    <div className={`item-name`}>
                        {
                            this.props.landing.examples.customizations
                                .selectedItem.name
                        }
                    </div>
                    <div className={`item-price`}>
                        {
                            this.props.landing.examples.customizations
                                .selectedItem.price
                        }{" "}
                        €
                    </div>
                    <div className={`item-description`}>
                        {
                            this.props.landing.examples.customizations
                                .selectedItem.description
                        }
                    </div>
                </div>
            </div>
            <div
                className={`view-02-footer`}
                ref={(div) => (this.view02footer = div)}
            >
                <button className={`payment-button`}>
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
                <div className={`item-back`}>
                    <div className={`back-icon`} />
                </div>
                <div className={`item-title`}>Customize</div>
                <div className={`item-price`}>
                    {this.props.landing.examples.customizations.itemPrice} €
                </div>
            </div>
            <div
                className={`view-03-body`}
                ref={(div) => (this.view03body = div)}
            >
                {this.props.landing.examples.customizations.selectedItem.specialFields.map(
                    (field) => this.renderField(field)
                )}
            </div>
            <div
                className={`view-03-footer`}
                ref={(div) => (this.view03footer = div)}
            >
                <button className={`payment-button`}>Add to cart</button>
            </div>
        </div>
    );
    renderField = (field) => {
        switch (field.type) {
            case "one":
                return (
                    <OptionSingle key={field.id} field={field} currency={"€"} />
                );
            case "many":
                return (
                    <OptionMany key={field.id} field={field} currency={"€"} />
                );
            default:
                return null;
        }
    };

    from0to01 = (id) => {
        this.tl
            .set(this.cursor, { opacity: 0, top: "327px", left: "157px" })
            .fromTo(this.cursor, 0.1, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.cursor,
                0.3,
                { top: "327px", left: "157px" },
                { top: "257px", left: "187px", delay: 1 }
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
            .set(this.view01, { opacity: 1})
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
            )
            //from01to02
            .fromTo(
                this.cursor,
                0.3,
                { top: "257px", left: "187px" },
                { top: "407px", left: "187px", delay: 1 }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(
                this.cursor,
                0.3,
                { top: "407px", left: "187px" },
                { top: "307px", left: "187px" }
            )
            .to(this.view01body, 0.3, { scrollTo: { y: 150 } }, "=-0.3")
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.3,
                { top: "307px", left: "187px" },
                { top: "437px", left: "147px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.view01body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "-=0.1"
            )
            .fromTo(this.view01footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view01header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .set(this.view01, { opacity: 0 })
            .set(this.view02, { opacity: 1})
            .fromTo(this.view02body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(
                this.view02header,
                0.2,
                { y: "-100%" },
                { y: "0%" },
                "=-0.2"
            )
            .fromTo(this.view02footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2")
            //from02to03
            .fromTo(
                this.cursor,
                0.6,
                { top: "437px", left: "147px" },
                { top: "667px", left: "147px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.view02header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.1"
            )
            .fromTo(this.view02footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view02body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.2"
            )
            .set(this.view02, { opacity: 0})
            .set(this.view03, { opacity: 1})
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
            )
            .fromTo(this.view03footer, 0.2, { y: "100%" }, { y: "0%" })
            // from03to0
            .fromTo(
                this.cursor,
                0.7,
                { top: "667px", left: "147px" },
                { top: "210px", left: "40px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .call(() => this.props.landingExampleCustomizations1())
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.5,
                { top: "210px", left: "40px" },
                { top: "440px", left: "40px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .call(() => this.props.landingExampleCustomizations2())
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.2,
                { top: "440px", left: "40px" },
                { top: "450px", left: "140px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(
                this.cursor,
                0.5,
                { top: "450px", left: "140px" },
                { top: "250px", left: "140px" }
            )
            .to(this.view03body, 0.5, { scrollTo: { y: 200 } }, "=-0.5")
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.5,
                { top: "250px", left: "140px" },
                { top: "460px", left: "160px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(
                this.cursor,
                0.5,
                { top: "460px", left: "160px" },
                { top: "310px", left: "160px" }
            )
            .to(this.view03body, 0.5, { scrollTo: { y: 350 } }, "=-0.5")
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.5,
                { top: "310px", left: "160px" },
                { top: "320px", left: "60px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .call(() => this.props.landingExampleCustomizations3())
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.cursor,
                0.5,
                { top: "320px", left: "60px" },
                { top: "687px", left: "190px" }
            )
            .fromTo(this.cursor, 0.1, { scale: 1 }, { scale: 0.5 })
            .fromTo(this.cursor, 0.1, { scale: 0.5 }, { scale: 1 })
            .fromTo(
                this.view03body,
                0.2,
                { opacity: 1 },
                { opacity: 0 },
                "=-0.1"
            )
            .fromTo(this.view03footer, 0.2, { y: "0%" }, { y: "100%" }, "=-0.2")
            .fromTo(
                this.view03header,
                0.2,
                { y: "0%" },
                { y: "-100%" },
                "=-0.2"
            )
            .fromTo(this.cursor, 0.3, { opacity: 1 }, { opacity: 0 }, "=-0.2")
            .set(this.view03, { opacity: 0 })
            .set(this.view0, { opacity: 1 })
            .fromTo(this.view0body, 0.2, { opacity: 0 }, { opacity: 1 })
            .fromTo(this.view0header, 0.2, { y: "-100%" }, { y: "0%" }, "=-0.2")
            .fromTo(this.view0footer, 0.2, { y: "100%" }, { y: "0%" }, "=-0.2")
            .call(() => this.props.landingExampleCustomizationsReset());
    };
    render = () => {
        return (
            <div id="example">
                {this.HTMLview0(1)}
                {this.HTMLview01()}
                {this.HTMLview02()}
                {this.HTMLview03()}
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
    landingExampleCustomizations1,
    landingExampleCustomizations2,
    landingExampleCustomizations3,
    landingExampleCustomizationsReset,
};
export default connect(mapStateToProps, mapDispatchToProps)(Customizations);
