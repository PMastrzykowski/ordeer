import React from 'react';
import {
    Link
} from "react-router-dom";
import axios from 'axios';
import { connect } from 'react-redux';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    resetEditField, resetValidate, resetInvalid, resetSetId, resetSetStatus,
    resetTogglePassword
} from '../../actions/reset';
import { api } from '../../api';

class Reset extends React.Component {

    componentDidMount = () => {
        let locationSplit = (this.props.location.pathname).split('/');
        let id;
        if (locationSplit.length < 3) {
            this.props.resetSetStatus('fail')
        } else {
            id = locationSplit[2];
            axios.post(`${api}/api/users/isresetvalid`, { id })
                .then(res => {
                    this.props.resetSetId(id)
                    this.props.resetSetStatus('ready')
                })
                .catch(err => {
                    this.props.resetSetStatus('fail')
                });
        }
    }
    handleInputChange = (e) => {
        this.props.resetEditField({ [e.target.name]: e.target.value })
    }
    secondValidation = () => {
        if (!this.props.reset.valid) {
            this.frontValidation()
        }
    }
    frontValidation = () => {
        let errors = {
            password: ''
        };
        let valid = true;
        if (this.props.reset.fields.password.length < 6 || this.props.reset.fields.password.length > 30) {
            errors.password = 'Password must be 6 - 30 characters long.';
            valid = false;
        }
        this.props.resetValidate(errors, valid);
        return valid;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.resetSetStatus('loading');
            const user = {
                password: this.props.reset.fields.password,
                id: this.props.reset.id
            }
            axios.post(`${api}/api/users/reset`, user)
                .then(res => {
                    this.props.resetSetStatus('success')
                })
                .catch(err => {
                    this.props.resetSetStatus('fail')
                });
        }
    }
    renderContent = () => {
        switch (this.props.reset.status) {
            case 'loading':
                return <div>
                    Loading
            </div>
            case 'ready':
                return <div className='auth'>
                    <div className='auth-inner'>
                        <div><Link to="/" id='logo'>QR Spots</Link></div>
                        <div className='title' ref={div => this.title = div}>Change password</div>
                        <div className='description' ref={div => this.title = div}>Insert your new password in the fields below.</div>
                        <form onSubmit={this.handleSubmit}>
                            <div className={this.props.reset.errors.password.length > 0 ? 'error' : ''}>
                                <label className={`box-label`}>Password
                                <div className='password-input'>
                                        <input
                                            className={`box-input`}
                                            type={this.props.reset.showPassword ? 'text' : "password"}
                                            name="password"
                                            onChange={this.handleInputChange}
                                            onBlur={this.secondValidation}
                                            value={this.props.reset.fields.password}
                                        />
                                        <div className={`show-password ${this.props.reset.showPassword ? 'visible' : ''}`} onClick={this.props.resetTogglePassword}><FontAwesomeIcon icon={this.props.reset.showPassword ? faEye : faEyeSlash} size="lg" /></div>
                                    </div>
                                    <div className='error-text'>{this.props.reset.errors.password}</div>
                                </label>
                            </div>
                            {this.props.reset.status === 'loading' ? <button>loading</button> : <button className='submit-button' type='submit' ref={div => this.submit = div}>Change password</button>}
                        </form>
                        <div className='dont-have-account' ref={div => this.haveAccount = div}>Remember password? <Link to="/login/"><span className='link'>Log in!</span></Link></div>
                    </div>
                </div>
            case 'success':
                return <div className='auth'>
                    <div className='auth-inner'>
                        <div className='description bigger' ref={div => this.title = div}>Password was successfully changed.</div>
                        <Link to='/login/'><button className='submit-button'>Log in</button></Link>
                    </div>
                </div>
            case 'fail':
                return <div className='auth'>
                    <div className='auth-inner'>
                        <div className='description bigger' ref={div => this.title = div}>Reset link is invalid.</div>
                        <Link to='/'><button className='submit-button' type='submit' ref={div => this.submit = div}>Back</button></Link>
                    </div>
                </div>
            default:
                return null;
        }
    }
    render = () => {
        return (<>{this.renderContent()}</>)
    }
}
const mapStateToProps = state => ({
    reset: state.reset,
    auth: state.auth
});
const mapDispatchToProps = {
    resetEditField,
    resetValidate,
    resetInvalid,
    resetSetId,
    resetSetStatus,
    resetTogglePassword
};
export default connect(mapStateToProps, mapDispatchToProps)(Reset);
