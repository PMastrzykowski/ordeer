import React from "react";
import { connect } from "react-redux";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import { setAuthToken } from "../helpers/auth";
import jwt_decode from "jwt-decode";
import { setAuthTokenSocket } from "../socket";
// Components
import PreNewOrder from "./client/new_order/PreNewOrder";
import NewOrder from "./client/new_order/NewOrder";
import Home from "./client/Home";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Forgot from "./auth/Forgot";
import Activate from "./auth/Activate";
import {
    setCurrentUser,
    loginSocketLoaded,
    logoutUser,
} from "../actions/login";
import Reset from "./auth/Reset";
import PreWrapper from "./manager/PreWrapper";
import Token from "./manager/stripe/Token";
import P24Token from "./client/new_order/features/feature-partials/P24Token";
const reload = () => window.location.reload();

class RouterComponent extends React.Component {
    componentDidMount = async () => {
        let token = localStorage.jwtToken;
        if (token) {
            try {
                const decoded = jwt_decode(token);
                const currentTime = Date.now() / 1000;
                if (decoded.exp <= currentTime) {
                    await setAuthTokenSocket("");
                    this.props.logoutUser();
                } else {
                    setAuthToken(token);
                    await setAuthTokenSocket(token);
                    this.props.setCurrentUser(token);
                }
            } catch (error) {
                console.log("👾 invalid token format", error);
                await setAuthTokenSocket("");
                this.props.logoutUser();
            }
        } else {
            await setAuthTokenSocket("");
        }
        this.props.loginSocketLoaded();
        
    };
    render = () => {
        return this.props.auth.socketLoaded ? (
            <Router>
                <Switch>
                    <Route path="/qr/:id" component={PreNewOrder} />
                    <Route path="/p24token/:id" component={P24Token} />
                    <Route
                        path="/neworder/:place/:id"
                        exact
                        render={(routeProps) => (
                            <NewOrder contentType={"hi"} {...routeProps} />
                        )}
                    />
                    <Route
                        path="/neworder/:place/:id/menu"
                        exact
                        render={(routeProps) => (
                            <NewOrder contentType={"menu"} {...routeProps} />
                        )}
                    />
                    <Route
                        path="/neworder/:place/:id/cart/:cartItem"
                        exact
                        render={(routeProps) => (
                            <NewOrder contentType={"cart-item"} {...routeProps} />
                        )}
                    />
                    <Route
                        path="/neworder/:place/:id/cart"
                        render={(routeProps) => (
                            <NewOrder
                            exact
                                contentType={"cart"}
                                {...routeProps}
                            />
                        )}
                    />
                    <Route
                        path="/neworder/:place/:id/payment"
                        render={(routeProps) => (
                            <NewOrder contentType={"payment"} {...routeProps} />
                        )}
                    />
                    <Route
                        path="/neworder/:place/:id/menu/:item"
                        exact
                        render={(routeProps) => (
                            <NewOrder contentType={"item"} {...routeProps} />
                        )}
                    />
                    <Route
                        path="/admin/dashboard"
                        render={(routeProps) => (
                            <PreWrapper
                                contentType={"dashboard"}
                                {...routeProps}
                            />
                        )}
                    />
                    <Route
                        path="/admin/token"
                        render={(routeProps) => <Token {...routeProps} />}
                    />
                    <Route
                        exact
                        path="/admin/users"
                        render={(routeProps) => (
                            <PreWrapper contentType={"users"} {...routeProps} />
                        )}
                    />
                    <Route
                        exact
                        path="/admin/plans"
                        render={(routeProps) => (
                            <PreWrapper contentType={"plans"} {...routeProps} />
                        )}
                    />
                    <Route
                        exact
                        path="/admin/settings"
                        render={(routeProps) => (
                            <PreWrapper
                                contentType={"settings"}
                                {...routeProps}
                            />
                        )}
                    />
                    <Route path="/admin/*">
                        <Redirect to="/admin/dashboard" />
                    </Route>
                    <Route exact path="/register" component={Register} />
                    <Route path="/reset" component={Reset} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/forgot" component={Forgot} />
                    <Route path="/activate" component={Activate} />
                    <Route path="/" component={Home} />
                    <Route path="/.well-known/apple-developer-merchantid-domain-association" onEnter={reload} />
                </Switch>
            </Router>
        ) : (
            <div>Loading socket connection</div>
        );
    };
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});
const mapDispatchToProps = {
    setCurrentUser,
    loginSocketLoaded,
    logoutUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(RouterComponent);
