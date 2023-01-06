import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { activateSetStatus } from "../../actions/activate";
import { api } from "../../api";
import Loader from "../partials/Loader";

const Activate = (props) => {
    const dispatch = useDispatch();
    const { activate, user } = useSelector((state) => ({
        activate: state.activate,
        user: state.user,
    }));
    useEffect(() => {
        let locationSplit = props.location.pathname.split("/");
        let id;
        if (locationSplit.length < 3) {
            dispatch(activateSetStatus("fail"));
        } else {
            id = locationSplit[2];
            const activateUser = async () => {
                try {
                    const res = await axios.post(`${api}/api/users/activate`, {
                        id,
                    });
                    if (res.data.success) {
                        dispatch(activateSetStatus("success"));
                    } else {
                        dispatch(activateSetStatus("fail"));
                    }
                } catch (err) {
                    dispatch(activateSetStatus("fail"));
                }
            };
            activateUser();
        }
    }, []);
    const renderContent = () => {
        switch (activate.status) {
            case "loading":
                return (
                    <div className="auth loading">
                        <Loader />
                    </div>
                );
            case "fail":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            <div className="description bigger">
                                Activation link is invalid.
                            </div>
                            <Link to="/">
                                <button className="submit-button">Back</button>
                            </Link>
                        </div>
                    </div>
                );
            case "success":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            <div className="description bigger">
                                Activation successfull! You can log in now.
                            </div>
                            <Link to="/login">
                                <button className="submit-button">Login</button>
                            </Link>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <>
            {user.isAuthenticated ? (
                <Navigate to="/" replace={true} />
            ) : (
                renderContent()
            )}
        </>
    );
};
export default Activate;
