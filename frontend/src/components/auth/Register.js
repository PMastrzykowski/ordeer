import React from "react";
import { BrowserRouter as Link, Redirect } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    registerEditField,
    registerValidate,
    registerSetStatus,
    registerTogglePassword,
} from "../../actions/register";
import { api } from "../../api";
import ReCAPTCHA from "react-google-recaptcha";
import Loader from '../partials/Loader';

class Register extends React.Component {

    handleInputChange = (e) => {
        this.props.registerEditField({ [e.target.name]: e.target.value });
    };
    secondValidation = () => {
        if (!this.props.register.valid) {
            this.frontValidation();
        }
    };
    frontValidation = () => {
        const validateEmail = (email) => {
            //eslint-disable-next-line
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        let errors = {
            name: "",
            email: "",
            password: "",
        };
        let valid = true;
        if (
            this.props.register.fields.name.length === 0 ||
            this.props.register.fields.name.length > 20
        ) {
            errors.name = "Name must be 1 - 20 characters long.";
            valid = false;
        }
        if (!validateEmail(this.props.register.fields.email)) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        if (
            this.props.register.fields.password.length < 6 ||
            this.props.register.fields.password.length > 30
        ) {
            errors.password = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        this.props.registerValidate(errors, valid);
        return valid;
    };
    handleSubmit = (e) => {
            e.preventDefault();
        if (this.frontValidation()) {
            this.props.registerSetStatus("loading");
            const user = {
                name: this.props.register.fields.name,
                email: this.props.register.fields.email,
                password: this.props.register.fields.password,
            };
            axios
                .post(`${api}/api/users/register`, user)
                .then((res) => {
                    this.props.registerSetStatus("success");
                })
                .catch((err) => {
                    this.props.registerValidate(err.response.data, true);
                    this.props.registerSetStatus("ready");
                });
        }
    };
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/");
        } else {
            this.props.registerSetStatus("ready");
        }
    }
    renderContent = () => {
        switch (this.props.register.status) {
            case "loading":
            case "ready":
                return (
                    <div className="auth">
                        <div className="auth-inner">
                            <Link to="/" id="logo">
                                <div className={"main-logo"} />
                            </Link>
                            {/* <div className='title' ref={div => this.title = div}>Register</div> */}
                            <div className="description">
                                Insert your details to register.
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <div
                                    className={
                                        this.props.register.errors.name.length >
                                        0
                                            ? "error"
                                            : ""
                                    }
                                >
                                    <label className={`box-label`}>
                                        Name
                                        <input
                                            className={`box-input`}
                                            type="text"
                                            name="name"
                                            onChange={this.handleInputChange}
                                            onBlur={this.secondValidation}
                                            value={
                                                this.props.register.fields.name
                                            }
                                            ref={(div) =>
                                                (this.nameInput = div)
                                            }
                                        />
                                        <div className="error-text">
                                            {this.props.register.errors.name}
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={
                                        this.props.register.errors.email
                                            .length > 0
                                            ? "error"
                                            : ""
                                    }
                                >
                                    <label className={`box-label`}>
                                        Email
                                        <input
                                            className={`box-input`}
                                            type="email"
                                            name="email"
                                            onChange={this.handleInputChange}
                                            onBlur={this.secondValidation}
                                            value={
                                                this.props.register.fields.email
                                            }
                                            ref={(div) =>
                                                (this.emailInput = div)
                                            }
                                        />
                                        <div className="error-text">
                                            {this.props.register.errors.email}
                                        </div>
                                    </label>
                                </div>
                                <div
                                    className={
                                        this.props.register.errors.password
                                            .length > 0
                                            ? "error"
                                            : ""
                                    }
                                >
                                    <label className={`box-label`}>
                                        Password
                                        <div className="password-input">
                                            <input
                                                className={`box-input`}
                                                type={
                                                    this.props.register
                                                        .showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                onChange={
                                                    this.handleInputChange
                                                }
                                                onBlur={this.secondValidation}
                                                value={
                                                    this.props.register.fields
                                                        .password
                                                }
                                                ref={(div) =>
                                                    (this.passwordInput = div)
                                                }
                                            />
                                            <div
                                                className={`show-password ${
                                                    this.props.register
                                                        .showPassword
                                                        ? "visible"
                                                        : ""
                                                }`}
                                                onClick={
                                                    this.props
                                                        .registerTogglePassword
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        this.props.register
                                                            .showPassword
                                                            ? faEye
                                                            : faEyeSlash
                                                    }
                                                    size="lg"
                                                />
                                            </div>
                                        </div>
                                        <div className="error-text">
                                            {
                                                this.props.register.errors
                                                    .password
                                            }
                                        </div>
                                    </label>
                                </div>
                                <ReCAPTCHA
                                className={'recaptcha'}
                                    sitekey="Your client site key"
                                    onChange={()=>{}}
                                />
                                {this.props.register.status === "loading" ? (
                                    <div className='submit-button login-loader'><Loader /></div>
                                ) : (
                                    <button
                                        className="submit-button"
                                        type="submit"
                                        onClick={this.props.register.status === 'loading' ? null : this.handleSubmit}
                                        ref={(div) => (this.submit = div)}
                                    >
                                        Register
                                    </button>
                                )}
                            </form>
                            <div
                                className="dont-have-account"
                                ref={(div) => (this.haveAccount = div)}
                            >
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
                                within <strong>24h</strong>!
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
        return (
            <>
                {this.props.auth.isAuthenticated ? (
                    <Redirect to="/" />
                ) : (
                    <>{this.renderContent()}</>
                )}
            </>
        );
    };
}
const mapStateToProps = (state) => ({
    register: state.register,
    auth: state.auth,
});
const mapDispatchToProps = {
    registerEditField,
    registerValidate,
    registerSetStatus,
    registerTogglePassword,
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
