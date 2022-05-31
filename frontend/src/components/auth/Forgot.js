import React from 'react';
import {
    Link, Redirect
} from "react-router-dom";
import axios from 'axios';
import { connect } from 'react-redux';
import { loginEditField, loginValidate, loginSetStatus } from '../../actions/login';
import { api } from '../../api';

class Frogot extends React.Component {
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
            email: ''
        };
        let valid = true;
        if (!validateEmail(this.props.login.fields.email)) {
            errors.email = 'Email is invalid.';
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
                email: this.props.login.fields.email
            }
            axios.post(`${api}/api/users/forgotpassword`, user)
                .then(res => {
                    this.props.loginSetStatus('success');
                })
                .catch(err => {
                    this.props.loginValidate(err.response.data, true);
                    this.props.loginSetStatus('ready');
                });
        }
    }
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/');
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
                        {/* <div className='title' ref={div => this.title = div}>Forgot password</div> */}
                        <div className='description'>Insert your email addres so we can send you the reset password link.</div>
                        <form onSubmit={this.handleSubmit}>
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
                            {this.props.login.status === 'loading' ? <button>loading</button> : <button className='submit-button' type='submit' ref={div => this.submit = div}>Request password change</button>}
                        </form>
                        <div className='dont-have-account' ref={div => this.haveAccount = div}>Remember password? <Link to="/login/"><span className='link'>Log in!</span></Link></div>
                    </div>
                </div>
            case 'success':
                return <div className='auth'>
                    <div className='auth-inner'>
                        <div className='description bigger'>The reset password link was sent to your mailbox. Please click the link we attached within <strong>24h</strong>!</div>
                        <Link to='/'><button className='submit-button'>Back</button></Link>
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
                        ? <Redirect to="/" />
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
    loginSetStatus
};
export default connect(mapStateToProps, mapDispatchToProps)(Frogot);