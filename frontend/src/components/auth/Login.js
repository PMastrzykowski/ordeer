import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    loginEditField,
    loginValidate,
    loginLoginUser,
    loginSetStatus,
    loginTogglePassword,
} from "../../actions/login";
import { api } from "../../api";
import Loader from "../partials/Loader";
import { getData } from "../../helpers/auth";
import { useEffect } from "react";
import { validateEmail } from "../../helpers/utils";

const Login = (props) => {
    const dispatch = useDispatch();
    const { login, user } = useSelector((state) => ({
        login: state.login,
        user: state.user,
    }));
    const handleInputChange = (e) => {
        dispatch(loginEditField({ [e.target.name]: e.target.value }));
    };
    const secondValidation = () => {
        if (!login.valid) {
            frontValidation();
        }
    };
    const frontValidation = () => {
        let errors = {
            email: "",
            password: "",
        };
        let valid = true;
        if (!validateEmail(login.fields.email)) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        if (
            login.fields.password.length < 6 ||
            login.fields.password.length > 30
        ) {
            errors.password = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        dispatch(loginValidate(errors, valid));
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (frontValidation()) {
            dispatch(loginSetStatus("loading"));
            const user = {
                email: login.fields.email,
                password: login.fields.password,
            };
            try {
                await axios.post(`${api}/api/users/login`, user);
                localStorage.setItem("firstLogin", true);
                const userData = await getData();
                dispatch(loginLoginUser(userData.user.data));
                props.navigate("/", { replace: true });
            } catch (err) {
                dispatch(loginValidate(err.response.data, true));
                dispatch(loginSetStatus("ready"));
            }
        }
    };
    const renderContent = () => {
        switch (login.status) {
            case "loading":
            case "ready":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            <div className="title">Log in</div>
                            <div className="description">
                                Insert your login details to sign in.
                            </div>
                            <form
                                onSubmit={
                                    login.status === "loading"
                                        ? null
                                        : handleSubmit
                                }
                            >
                                <div
                                    className={
                                        login.errors.email.length > 0
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
                                            value={login.fields.email}
                                        />
                                        <div className="error-text">
                                            {login.errors.email}
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={
                                        login.errors.password.length > 0
                                            ? "error box-label"
                                            : "box-label"
                                    }
                                >
                                    <label>
                                        <div className="box-label-name">
                                            Password
                                        </div>
                                        <div className="password-input">
                                            <input
                                                className={`box-input`}
                                                type={
                                                    login.showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                onChange={handleInputChange}
                                                onBlur={secondValidation}
                                                value={login.fields.password}
                                            />
                                            <div
                                                className={`show-password ${
                                                    login.showPassword
                                                        ? "visible"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    dispatch(
                                                        loginTogglePassword
                                                    )
                                                }
                                            ></div>
                                        </div>
                                        <div className="error-text">
                                            {login.errors.password}
                                        </div>
                                    </label>
                                </div>
                                <div className="forgot-password">
                                    <Link to="/forgot/">
                                        <span className="link">
                                            Forgot password?
                                        </span>
                                    </Link>
                                </div>
                                {login.status === "loading" ? (
                                    <div className="submit-button login-loader">
                                        <Loader />
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="submit-button"
                                        onClick={
                                            login.status === "loading"
                                                ? null
                                                : handleSubmit
                                        }
                                    >
                                        Log in
                                    </button>
                                )}
                            </form>
                            <div className="dont-have-account">
                                Don't have an account yet?{" "}
                                <Link to="/register/">
                                    <span className="link">Try for free!</span>
                                </Link>
                            </div>
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
export default Login;
