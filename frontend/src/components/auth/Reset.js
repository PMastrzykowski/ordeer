import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
    resetEditField,
    resetValidate,
    resetSetId,
    resetSetStatus,
    resetTogglePassword,
} from "../../actions/reset";
import { api } from "../../api";

const Reset = (props) => {
    const dispatch = useDispatch();
    const { reset, user } = useSelector((state) => ({
        reset: state.reset,
        user: state.user,
    }));
    useEffect(() => {
        let locationSplit = props.location.pathname.split("/");
        let id;
        if (locationSplit.length < 3) {
            dispatch(resetSetStatus("fail"));
        } else {
            const reset = async () => {
                id = locationSplit[2];
                try {
                    await axios.post(`${api}/api/users/isresetvalid`, { id });
                    dispatch(resetSetId(id));
                    dispatch(resetSetStatus("ready"));
                } catch (err) {
                    dispatch(resetSetStatus("fail"));
                }
            };
            reset();
        }
    }, []);
    const handleInputChange = (e) => {
        dispatch(resetEditField({ [e.target.name]: e.target.value }));
    };
    const secondValidation = () => {
        if (!reset.valid) {
            frontValidation();
        }
    };
    const frontValidation = () => {
        let errors = {
            password: "",
        };
        let valid = true;
        if (
            reset.fields.password.length < 6 ||
            reset.fields.password.length > 30
        ) {
            errors.password = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        dispatch(resetValidate(errors, valid));
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (frontValidation()) {
            dispatch(resetSetStatus("loading"));
            const user = {
                password: reset.fields.password,
                id: reset.id,
            };
            try {
                await axios.post(`${api}/api/users/reset`, user);
                dispatch(resetSetStatus("success"));
            } catch (err) {
                dispatch(resetSetStatus("fail"));
            }
        }
    };
    const renderContent = () => {
        switch (reset.status) {
            case "loading":
                return <div>Loading</div>;
            case "ready":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            <div className="title">Change password</div>
                            <div className="description">
                                Insert your new password in the fields below.
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div
                                    className={
                                        reset.errors.password.length > 0
                                            ? "error box-label"
                                            : "box-label"
                                    }
                                >
                                    <label>
                                        <div className={`box-label-name`}>
                                            Password
                                        </div>
                                        <div className="password-input">
                                            <input
                                                className={`box-input`}
                                                type={
                                                    reset.showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                onChange={handleInputChange}
                                                onBlur={secondValidation}
                                                value={reset.fields.password}
                                            />
                                            <div
                                                className={`show-password ${
                                                    reset.showPassword
                                                        ? "visible"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    dispatch(
                                                        resetTogglePassword()
                                                    )
                                                }
                                            ></div>
                                        </div>
                                        <div className="error-text">
                                            {reset.errors.password}
                                        </div>
                                    </label>
                                </div>
                                {reset.status === "loading" ? (
                                    <button>loading</button>
                                ) : (
                                    <button
                                        className="submit-button"
                                        type="submit"
                                    >
                                        Change password
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
                                Password was successfully changed.
                            </div>
                            <Link to="/login/">
                                <button className="submit-button">
                                    Log in
                                </button>
                            </Link>
                        </div>
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
                                Reset link is invalid.
                            </div>
                            <Link to="/">
                                <button className="submit-button" type="submit">
                                    Back
                                </button>
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
export default Reset;
