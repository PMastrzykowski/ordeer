import React from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { loginUser } from "../../actions/login";
import { activateSetStatus } from "../../actions/activate";
import { api } from "../../api";

class Activate extends React.Component {
    componentDidMount = () => {
        let locationSplit = this.props.location.pathname.split("/");
        let id;
        if (locationSplit.length < 3) {
            this.props.activateSetStatus("fail");
        } else {
            id = locationSplit[2];
            axios
                .post(`${api}/api/users/activate`, { id })
                .then((res) => {
                    if (res.data.success) {
                        this.props.loginUser(res.data.token);
                        this.props.history.push("/");
                    } else {
                        this.props.activateSetStatus("fail");
                    }
                })
                .catch((err) => {
                    this.props.activateSetStatus("fail");
                });
        }
    };
    renderContent = () => {
        switch (this.props.activate.status) {
            case "loading":
                return <div>Loading</div>;
            case "fail":
            case "success":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <div className="description bigger">
                                Activation link is invalid.
                            </div>
                            <Link to="/">
                                <button className="submit-button">Back</button>
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    render = () => {
        return <>{this.renderContent()}</>;
    };
}
const mapStateToProps = (state) => ({
    activate: state.activate,
});
const mapDispatchToProps = {
    loginUser,
    activateSetStatus,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Activate));
