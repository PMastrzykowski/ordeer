import React from 'react';
import {
    Link, Redirect
} from "react-router-dom";
import axios from 'axios';
import { connect } from 'react-redux';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loginEditField, loginValidate, loginUser, loginSetStatus, loginTogglePassword } from '../../actions/login';
// import { login } from '../../helpers/auth';
import { api } from '../../api';
import Loader from '../partials/Loader';

class Login extends React.Component {

    handleInputChange = (e) => {
        this.props.loginEditField({ [e.target.name]: e.target.value })
    }
    secondValidation = () => {
        if (!this.props.login.valid) {
            this.frontValidation()
        }
    }
    frontValidation = () => {
        const validateEmail = (email) => {
            //eslint-disable-next-line
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        let errors = {
            email: '',
            password: ''
        };
        let valid = true;
        if (!validateEmail(this.props.login.fields.email)) {
            errors.email = 'Email is invalid.';
            valid = false;
        }
        if (this.props.login.fields.password.length < 6 || this.props.login.fields.password.length > 30) {
            errors.password = 'Password must be 6 - 30 characters long.';
            valid = false;
        }
        this.props.loginValidate(errors, valid);
        return valid;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.loginSetStatus('loading');
            const user = {
                email: this.props.login.fields.email,
                password: this.props.login.fields.password
            }
            axios.post(`${api}/api/users/login`, user)
                .then(res => {
                    this.props.loginUser(res.data.token)
                })
                .catch(err => {
                    this.props.loginValidate(err.response.data, true);
                    this.props.loginSetStatus('ready')
                });
        }
    }
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/admin/dashboard');
        } else {
            this.props.loginSetStatus('ready');
        }
    }
    renderContent = () => {
        switch (this.props.login.status) {
            case 'loading':
            case 'ready':
                return <div className='auth'>
                    <div className='auth-inner'>
                    <Link to="/" id='logo'><div className={'main-logo'}/></Link>
                        {/* <div className='title' ref={div => this.title = div}>Log in</div> */}
                        <div className='description'>Insert your login details to sign in.</div>
                        <form onSubmit={this.props.login.status === 'loading' ? null : this.handleSubmit}>
                            <div className={this.props.login.errors.email.length > 0 ? 'error' : ''}>
                                <label className={`box-label`}>
                                    Email
                                <input
                                        className={`box-input`}
                                        type="email"
                                        name="email"
                                        onChange={this.handleInputChange}
                                        onBlur={this.secondValidation}
                                        value={this.props.login.fields.email}
                                        ref={div => this.emailInput = div}
                                    />

                                    <div className='error-text'>{this.props.login.errors.email}</div>
                                </label>
                            </div>
                            <div className={this.props.login.errors.password.length > 0 ? 'error' : ''}>
                                <label className={`box-label`}>Password
                                <div className='password-input'>
                                        <input
                                            className={`box-input`}
                                            type={this.props.login.showPassword ? 'text' : "password"}
                                            name="password"
                                            onChange={this.handleInputChange}
                                            onBlur={this.secondValidation}
                                            value={this.props.login.fields.password}
                                            ref={div => this.passwordInput = div}
                                        />
                                        <div className={`show-password ${this.props.login.showPassword ? 'visible' : ''}`} onClick={this.props.loginTogglePassword}><FontAwesomeIcon icon={this.props.login.showPassword ? faEye : faEyeSlash} size="lg" /></div>
                                    </div>
                                    <div className='error-text'>{this.props.login.errors.password}</div>
                                </label>
                            </div>
                            <div className='forgot-password'><Link to="/forgot/"><span className='link'>Forgot password?</span></Link></div>
                            {this.props.login.status === 'loading'
                                ? <div className='submit-button login-loader'><Loader /></div>
                                : <button type='submit' className='submit-button' onClick={this.props.login.status === 'loading' ? null : this.handleSubmit} ref={div => this.submit = div}>Log in</button>
                            }
                        </form>
                        <div className='dont-have-account' ref={div => this.haveAccount = div}>Don't have an account yet? <Link to="/register/"><span className='link'>Try for free!</span></Link></div>
                    </div>
                </div>
            default:
                return null;
        }
    }
    render = () => {
        return (
            <>
                {
                    this.props.auth.isAuthenticated
                        ? <Redirect to="/admin/dashboard" />
                        :
                        <>{this.renderContent()}</>
                }
            </>
        )
    }
}
const mapStateToProps = state => ({
    login: state.login,
    auth: state.auth
});
const mapDispatchToProps = {
    loginEditField,
    loginValidate,
    loginUser,
    loginSetStatus,
    loginTogglePassword
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
