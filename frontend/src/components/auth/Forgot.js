import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    forgotEditField,
    forgotValidate,
    forgotSetStatus,
    forgotInitiate,
} from "../../actions/forgot";
import { api } from "../../api";
import Loader from "../partials/Loader";
import { useEffect } from "react";
import { validateEmail } from "../../helpers/utils";

const Frogot = (props) => {
    const dispatch = useDispatch();
    const { forgot, user } = useSelector((state) => ({
        forgot: state.forgot,
        user: state.user,
    }));
    useEffect(() => {
        dispatch(forgotInitiate());
    }, []);
    const handleInputChange = (e) => {
        dispatch(forgotEditField({ [e.target.name]: e.target.value }));
    };
    const secondValidation = () => {
        if (!forgot.valid) {
            frontValidation();
        }
    };
    const frontValidation = () => {
        let errors = {
            email: "",
        };
        let valid = true;
        if (!validateEmail(forgot.fields.email)) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        dispatch(forgotValidate(errors, valid));
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (frontValidation()) {
            dispatch(forgotSetStatus("loading"));
            const user = {
                email: forgot.fields.email,
            };
            try {
                await axios.post(`${api}/api/users/forgotpassword`, user);
                dispatch(forgotSetStatus("success"));
            } catch (err) {
                dispatch(forgotValidate(err.response.data, true));
                dispatch(forgotSetStatus("ready"));
            }
        }
    };
    const renderContent = () => {
        switch (forgot.status) {
            case "loading":
            case "ready":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            <div className="title">Forgot password</div>
                            <div className="description">
                                Insert your email addres so we can send you the
                                reset password link.
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div
                                    className={
                                        forgot.errors.email.length > 0
                                            ? "error box-label"
                                            : "box-label"
                                    }
                                >
                                    <label>
                                        <div className="box-label-name">
                                            Email
                                        </div>
                                        <input
                                            className={`box-input`}
                                            type="email"
                                            name="email"
                                            onChange={handleInputChange}
                                            onBlur={secondValidation}
                                            value={forgot.fields.email}
                                        />
                                        <div className="error-text">
                                            {forgot.errors.email}
                                        </div>
                                    </label>
                                </div>
                                {forgot.status === "loading" ? (
                                    <div className="submit-button">
                                        <Loader />
                                    </div>
                                ) : (
                                    <button
                                        className="submit-button"
                                        type="submit"
                                    >
                                        Request password change
                                    </button>
                                )}
                            </form>
                            <div className="dont-have-account">
                                Remember password?{" "}
                                <Link to="/login/">
                                    <span className="link">Log in!</span>
                                </Link>
                            </div>
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
                                The reset password link was sent to your
                                mailbox. Please click the link we attached
                                within <strong>15 minutes</strong>!
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
export default Frogot;
