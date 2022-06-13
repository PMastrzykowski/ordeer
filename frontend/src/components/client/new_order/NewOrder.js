//http://localhost:3000/qr/hXXS4ByEp1zX3L9vb4sQjB
import React from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import axios from "axios";
import { setQrData } from "../../../actions/newOrder";
import { socket } from "../../../socket";
import { api } from "../../../api";
import Loader from "../../partials/Loader";
import FreshFeature from "./features/FreshFeature";

class NewOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: new Date(),
        };
    }
    componentDidMount = () => {
        let params = this.props.location.pathname.split("/");
        let pointId = params[2];
        let sessionId = params[3];
        let landing_test = false;
        console.log(params);
        if (pointId.slice(0, 6) === "test--") {
            pointId = pointId.slice(6);
            landing_test = true;
        }
        // socket.on('updateMenu', (data) => {
        //     //przeleć order i sprawdź co się zmieniło
        //     this.setState({
        //         menu: data.menu
        //     }, this.calculateBill)
        // })
        socket.on("connect", () => {
            if (!landing_test) {
                axios
                    .post(`${api}/api/users/fetchqrdata`, {
                        pointId,
                        sessionId,
                    })
                    .then((res) => {
                        res.data.pointId = pointId;
                        res.data.sessionId = sessionId;
                        this.props.setQrData(res.data);
                        socket.emit("join", sessionId);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                let data = {
                    pointId,
                    sessionId,
                    pointName: "Table 1",
                    pointFeature: "feature-4",
                    currency: "EUR",
                    layoutId: "",
                    layoutName: "",
                    placeId: pointId,
                    placeName: "Brovar",
                    placeMenu: {
                        "_id" : "7AVuXmRs2",
                        "name" : "Brovar",
                        "images" : [ 
                            {
                                "id" : "0VEDF1sZ0",
                                "url" : "https://www.liquor.com/thmb/zprBPKADweLm_AXXIwabGan3Xnc=/1000x1000/filters:fill(auto,1)/LIQUORS-10-best-nonalcoholic-beers-5078321-d4c79d1bcd6c45b2b266f48bc8ac8b1a.jpg"
                            }
                        ],
                        "categories" : [ 
                            {
                                "name" : "Donuts",
                                "id" : "5ufgFQ3xN"
                            }, 
                            {
                                "name" : "Pizza",
                                "id" : "pizza"
                            },
                            {
                                "name" : "Drinks",
                                "id" : "drinks"
                            },
                            {
                                "name" : "Sweets",
                                "id" : "sweets"
                            },
                        ],
                        "items" : [
                            {
                                "name" : "Donut",
                                "price" : "1000",
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [ 
                                    {
                                        "name" : "Filling",
                                        "type" : "one",
                                        "options" : [ 
                                            {
                                                "name" : "Plane",
                                                "id" : "8werazEah",
                                                "priceImpact" : 0,
                                                "value" : true,
                                                "default" : true
                                            }, 
                                            {
                                                "name" : "Strawberries",
                                                "id" : "Z2Y6SS3Ur",
                                                "priceImpact" : "100",
                                                "value" : false,
                                                "default" : false
                                            }, 
                                            {
                                                "name" : "Blueberries",
                                                "id" : "6DJp5f9OO",
                                                "priceImpact" : "200",
                                                "value" : false,
                                                "default" : false
                                            }
                                        ],
                                        "id" : "0Ldy@62D@"
                                    }, 
                                    {
                                        "name" : "Toppings",
                                        "type" : "many",
                                        "options" : [ 
                                            {
                                                "name" : "Powder",
                                                "id" : "XIQaBfKTX",
                                                "priceImpact" : "0",
                                                "value" : true,
                                                "default" : true
                                            }, 
                                            {
                                                "name" : "Almonds",
                                                "id" : "Auh8SzOfQ",
                                                "priceImpact" : "50",
                                                "value" : false,
                                                "default" : false
                                            }, 
                                            {
                                                "name" : "Marshmallows",
                                                "id" : "vKp7e$LOY",
                                                "priceImpact" : "100",
                                                "value" : false,
                                                "default" : false
                                            }
                                        ],
                                        "id" : "rk9hn78b3"
                                    }
                                ],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "5ufgFQ3xN"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "5ufgFQ3xN"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "5ufgFQ3xN"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "5ufgFQ3xN"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "5ufgFQ3xN"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "5ufgFQ3xN"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "pizza"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "pizza"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "pizza"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "pizza"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "sweets"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "sweets"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "sweets"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "sweets"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "sweets"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "sweets"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                            {
                                "name" : "Donuts",
                                "price" : 1000,
                                "description" : "Good donuts are good",
                                "tax" : 0,
                                "id" : "0i2Ev5G5R",
                                "images" : [ 
                                    {
                                        "id" : "98zlQ4aUP",
                                        "url" : "http://res.cloudinary.com/duqi6fe19/image/upload/v1650218409/qrspots/60805d9f1774d06ea85a5c7a/menus/7AVuXmRs2/0i2Ev5G5R/98zlQ4aUP.webp"
                                    }
                                ],
                                "specialFields" : [],
                                "workUnits" : [],
                                "available" : true,
                                "category" : "drinks"
                            },
                        ],
                        "place" : "60805d9f1774d06ea85a5c7a",
                        "__v" : 0
                    },
                    surveys: [],
                    review: "",
                    rating: 0,
                    isInTestMode: true,
                    exists: false,
                    open: true,
                    surveysPassed: false,
                    openDate: "",
                    closeDate: "",
                    total: 0
                };
                this.props.setQrData(data);
                socket.emit("join", `${pointId}--${sessionId}`);
            }
        });
        this.now = setInterval(() => {
            this.setState({
                now: new Date(),
            });
        }, 1000);
    };
    componentWillUnmount() {
        socket.close();
        clearInterval(this.now);
    }
    renderFeature = () => {
        switch (this.props.newOrder.pointFeature) {
            // case 'feature-0':
            //     return <Feature0 />;
            case "feature-1":
            case "feature-2":
            case "feature-3":
            case "feature-4":
                // return <Feature2 now={this.state.now} />;
                return (
                    <FreshFeature
                        contentType={this.props.contentType}
                        now={this.state.now}
                    />
                );
            default:
                return (
                    <div id={`new-order-loading`}>
                        <Loader />
                    </div>
                );
        }
    };
    render = () => {
        return <div id="fresh-new-order">{this.renderFeature()}</div>;
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
            setQrData,
        },
        dispatch
    );

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(NewOrder);
