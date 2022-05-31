import React from "react";
import {
    NavLink,
    withRouter,
} from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser, loginSetManagerData } from "../../actions/login";
import {
    stripeStartLoading,
    stripeStopLoading,
    stripeSetStripeData,
    stripeSetProducts,
    stripeSetPrices,
} from "../../actions/stripe";
import axios from "axios";
import { api } from "../../api";
import logo from "../ordeer-logo.svg";
import Users from "./Users";
import Plans from "./Plans";
import Settings from "./Settings";
import Dashboard from "./Dashboard";

class Wrapper extends React.Component {
    fetchAccount = () => {
        this.props.stripeStartLoading();
        axios
            .post(`${api}/api/stripe/get`, {
                stripeId: this.props.auth.user.stripeId,
            })
            .then((res) => {
                if (res.data.success) {
                    this.props.stripeSetStripeData(res.data);
                } else {
                    console.log(res.data);
                }
            })
            .catch((err) => {});
    };
    fetchPlans = () => {
        axios
            .get(`${api}/api/stripe/plans`)
            .then((res) => {
                if (res.data.success) {
                    this.props.stripeSetProducts(res.data.products.data);
                } else {
                    console.log(res.data);
                }
            })
            .catch((err) => {});
    };
    fetchPrices = () => {
        axios
            .get(`${api}/api/stripe/prices`)
            .then((res) => {
                if (res.data.success) {
                    this.props.stripeSetPrices(res.data.prices.data);
                } else {
                    console.log(res.data);
                }
            })
            .catch((err) => {});
    };
    fetchManagerData = () => {
        axios
            .post(`${api}/api/users/fetchmanagerdata`, {
                place: this.props.auth.user.id,
            })
            .then((res) => {
                this.props.loginSetManagerData(res.data);
            })
            .catch((err) => {});
    };
    componentDidMount = () => {
        this.fetchAccount();
        this.fetchPlans();
        this.fetchPrices();
        this.fetchManagerData();
    };
    renderContent = () => {
        switch (this.props.contentType) {
            case "dashboard":
                return <Dashboard />;
            case "users":
                return <Users />;
            case "plans":
                return <Plans />;
            case "settings":
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };
    render = () => {
        return (
            <div>
                <div id="navbar">
                    <div className={`navbar-inner`}>
                        <div className={`navbar-side`}>
                            <img src={logo} alt={`Logo`} />
                            <NavLink
                                exact
                                to="/admin/dashboard"
                                activeClassName="navbar-button-selected"
                            >
                                <div className={`navbar-button`}>Dashboard</div>
                            </NavLink>
                            <NavLink
                                to="/admin/users"
                                activeClassName="navbar-button-selected"
                            >
                                <div className={`navbar-button`}>Users</div>
                            </NavLink>
                            <NavLink
                                to="/admin/plans"
                                activeClassName="navbar-button-selected"
                            >
                                <div className={`navbar-button`}>Plans</div>
                            </NavLink>
                            <NavLink
                                to="/admin/settings"
                                activeClassName="navbar-button-selected"
                            >
                                <div className={`navbar-button`}>Setings</div>
                            </NavLink>
                        </div>
                        <div className={`navbar-side`}>
                            <div
                                className={`navbar-button`}
                                onClick={() =>
                                    this.props.logoutUser(this.props.history)
                                }
                            >
                                Logout
                            </div>
                        </div>
                    </div>
                </div>
                {this.renderContent()}
                <div id="footer"></div>
            </div>
        );
    };
}
const mapStateToProps = (state) => ({
    auth: state.auth,
});
const mapDispatchToProps = {
    logoutUser,
    loginSetManagerData,
    stripeStartLoading,
    stripeStopLoading,
    stripeSetStripeData,
    stripeSetProducts,
    stripeSetPrices,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Wrapper));
