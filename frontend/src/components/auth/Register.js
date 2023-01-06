import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
    registerEditField,
    registerValidate,
    registerSetStatus,
    registerTogglePassword,
    registerInitiate,
} from "../../actions/register";
import { api } from "../../api";
import Loader from "../partials/Loader";
import ReCAPTCHA from "react-google-recaptcha";
import { validateEmail } from "../../helpers/utils";

const Register = (props) => {
    const dispatch = useDispatch();
    const { register, user } = useSelector((state) => ({
        register: state.register,
        user: state.user,
    }));
    useEffect(() => {
        dispatch(registerInitiate());
    }, []);
    const handleInputChange = (e) => {
        dispatch(registerEditField({ [e.target.name]: e.target.value }));
    };
    const secondValidation = () => {
        if (!register.valid) {
            frontValidation();
        }
    };
    const frontValidation = () => {
        let errors = {
            name: "",
            email: "",
            password: "",
        };
        let valid = true;
        if (
            register.fields.name.length === 0 ||
            register.fields.name.length > 20
        ) {
            errors.name = "Name must be 1 - 20 characters long.";
            valid = false;
        }
        if (!validateEmail(register.fields.email)) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        if (
            register.fields.password.length < 6 ||
            register.fields.password.length > 30
        ) {
            errors.password = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        dispatch(registerValidate(errors, valid));
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (frontValidation()) {
            dispatch(registerSetStatus("loading"));
            const user = {
                name: register.fields.name,
                email: register.fields.email,
                password: register.fields.password,
            };
            try {
                await axios.post(`${api}/api/users/register`, user);
                dispatch(registerSetStatus("success"));
            } catch (err) {
                dispatch(registerValidate(err.response.data, true));
                dispatch(registerSetStatus("ready"));
            }
        }
    };
    const renderContent = () => {
        switch (register.status) {
            case "loading":
            case "ready":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            <div className="title">Register</div>
                            <div className="description">
                                Insert your details to register.
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div
                                    className={
                                        register.errors.name.length > 0
                                            ? "error box-label"
                                            : "box-label"
                                    }
                                >
                                    <label>
                                        <div className="box-label-name">
                                            Name
                                        </div>
                                        <input
                                            className={`box-input`}
                                            type="text"
                                            name="name"
                                            onChange={handleInputChange}
                                            onBlur={secondValidation}
                                            value={register.fields.name}
                                        />
                                        <div className="error-text">
                                            {register.errors.name}
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={
                                        register.errors.email.length > 0
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
                                            value={register.fields.email}
                                        />
                                        <div className="error-text">
                                            {register.errors.email}
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={
                                        register.errors.password.length > 0
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
                                                    register.showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                onChange={handleInputChange}
                                                onBlur={secondValidation}
                                                value={register.fields.password}
                                            />
                                            <div
                                                className={`show-password ${
                                                    register.showPassword
                                                        ? "visible"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    dispatch(
                                                        registerTogglePassword()
                                                    )
                                                }
                                            ></div>
                                        </div>
                                        <div className="error-text">
                                            {register.errors.password}
                                        </div>
                                    </label>
                                </div>
                                <ReCAPTCHA
                                    className={"recaptcha"}
                                    sitekey="Your client site key"
                                    onChange={() => {}}
                                />
                                {register.status === "loading" ? (
                                    <div className="submit-button login-loader">
                                        <Loader />
                                    </div>
                                ) : (
                                    <button
                                        className="submit-button"
                                        type="submit"
                                        onClick={
                                            register.status === "loading"
                                                ? null
                                                : handleSubmit
                                        }
                                    >
                                        Register
                                    </button>
                                )}
                            </form>
                            <div className="dont-have-account">
                                Have an account already?{" "}
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
                            <div className="description bigger">
                                The activation link was sent to your email
                                address. Click the activation link attached
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
export default Register;
