import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usersOpenModal, usersCloseModal, usersEditField, usersValidate, usersAddNewUser, usersTogglePassword, usersSetStatus, usersEditUsername, usersEditPassword, usersEditSearchField, usersRemoveUser } from '../../actions/users';
import Modal from '../partials/Modal';
import short from 'shortid';
import { api } from '../../api';

class Users extends React.Component {
    secondValidation = () => {
        if (!this.props.users.modal.valid) {
            this.frontValidation()
        }
    }
    frontValidation = () => {
        let errors = {
            username: '',
            password: ''
        };
        let valid = true;
        if (['new-user', 'edit-username'].includes(this.props.users.modal.view) && this.props.users.allUsers.filter(user => (user.username === this.props.users.modal.selection.username.toLowerCase().trim())
            && (user.id !== this.props.users.modal.selection.id)).length > 0) {
            errors.username = 'User alredy exists';
            valid = false;
        }
        if (['edit-username'].includes(this.props.users.modal.view) && this.props.users.allUsers.filter(user => (user.username === this.props.users.modal.selection.username.toLowerCase().trim())
            && (user.id === this.props.users.modal.selection.id)).length > 0) {
            this.props.usersCloseModal();
            valid = false;
        }
        if (['new-user', 'edit-username'].includes(this.props.users.modal.view) && (this.props.users.modal.selection.username.length === 0 || this.props.users.modal.selection.username.length > 20)) {
            errors.username = 'Username must be 1 - 20 characters long.';
            valid = false;
        }
        if (['new-user', 'edit-password'].includes(this.props.users.modal.view) && (this.props.users.modal.selection.password.length < 6 || this.props.users.modal.selection.password.length > 30)) {
            errors.password = 'Password must be 6 - 30 characters long.';
            valid = false;
        }
        this.props.usersValidate(errors, valid);
        return valid;
    }
    handleNewUser = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.usersSetStatus('loading');
            let user = {
                id: short.generate(),
                username: this.props.users.modal.selection.username.toLowerCase().trim(),
                password: this.props.users.modal.selection.password
            }
            axios.post(`${api}/api/users/adddesktopuser`, { place: this.props.auth.user.id, user })
                .then(res => {
                    this.props.usersAddNewUser(user);
                })
                .catch(err => {
                    this.props.usersValidate(err.response.data, true);
                    this.props.usersSetStatus('ready')
                });
        }
    }
    handleEditUsername = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.usersSetStatus('loading');
            let user = {
                id: this.props.users.modal.selection.id,
                username: this.props.users.modal.selection.username.toLowerCase().trim()
            }
            axios.post(`${api}/api/users/editdesktopusername`, { place: this.props.auth.user.id, user })
                .then(res => {
                    this.props.usersEditUsername(user);
                })
                .catch(err => {
                    this.props.usersValidate(err.response.data, true);
                    this.props.usersSetStatus('ready')
                });
        }
    }
    handleEditUserPassword = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.usersSetStatus('loading');
            let user = {
                id: this.props.users.modal.selection.id,
                password: this.props.users.modal.selection.password
            }
            axios.post(`${api}/api/users/editdesktopuserpassword`, { place: this.props.auth.user.id, user })
                .then(res => {
                    this.props.usersEditPassword(user);
                })
                .catch(err => {
                    this.props.usersValidate(err.response.data, true);
                    this.props.usersSetStatus('ready')
                });
        }
    }
    handleRemoveUser = (e) => {
        e.preventDefault();
        this.props.usersSetStatus('loading');
        axios.post(`${api}/api/users/removedesktopuser`, { place: this.props.auth.user.id, userId: this.props.users.modal.selection.id })
            .then(res => {
                this.props.usersRemoveUser(this.props.users.modal.selection.id);
            })
            .catch(err => {
                this.props.usersValidate(err.response.data, true);
                this.props.usersSetStatus('ready')
            });
    }
    renderModal = () => {
        switch (this.props.users.modal.view) {
            case 'new-user':
                return <div className='modal-inner'>
                    <div className='modal-header'>
                        <div className='title'>New user</div>
                    </div>
                    <div className='modal-essence'>
                        <section>
                            <div className='info'>Please fill the form below to create new user</div>
                        </section>
                        <section className={this.props.users.modal.errors.username.length > 0 ? 'error' : ''}>
                            <label className={`box-label`}>Username
                        <input
                                    className={`box-input`}
                                    type='text'
                                    onChange={e => this.props.usersEditField({ username: e.target.value })}
                                    onBlur={this.secondValidation}
                                    value={this.props.users.modal.selection.username} />
                                {this.props.users.modal.errors.username.length > 0 && <div className='error-text'>{this.props.users.modal.errors.username}</div>}
                            </label>
                        </section>
                        <section className={this.props.users.modal.errors.password.length > 0 ? 'error' : ''}>
                            <label className={`box-label`}>Password
                                <div className='password-input'>
                                    <input
                                        className={`box-input`}
                                        type={this.props.users.showPassword ? 'text' : "password"}
                                        onChange={e => this.props.usersEditField({ password: e.target.value })}
                                        onBlur={this.secondValidation}
                                        value={this.props.users.modal.selection.password} />
                                    <div className={`show-password ${this.props.users.showPassword ? 'visible' : ''}`} onClick={this.props.usersTogglePassword}><FontAwesomeIcon icon={this.props.users.showPassword ? faEye : faEyeSlash} size="lg" /></div>
                                </div>
                                {this.props.users.modal.errors.password.length > 0 && <div className='error-text'>{this.props.users.modal.errors.password}</div>}
                            </label>
                        </section>
                    </div>
                    <div className='modal-footer'>
                        <button className='negative' onClick={this.props.usersCloseModal}>Cancel</button>
                        {this.props.users.modal.status === 'loading' ? <button>loading</button> : <button className='positive' onClick={this.handleNewUser}>Create</button>}
                    </div>
                </div>
            case 'edit-username':
                return <div className='modal-inner'>
                    <div className='modal-header'>
                        <div className='title'>Edit username</div>
                    </div>
                    <div className='modal-essence'>
                        <section>
                            <div className='info'>Please type in a new username in the field below</div>
                        </section>
                        <section className={this.props.users.modal.errors.username.length > 0 ? 'error' : ''}>
                            <label className={`box-label`}>Username
                        <input
                                    className={`box-input`}
                                    type='text'
                                    onChange={e => this.props.usersEditField({ username: e.target.value })}
                                    onBlur={this.secondValidation}
                                    value={this.props.users.modal.selection.username} />
                                {this.props.users.modal.errors.username.length > 0 && <div className='error-text'>{this.props.users.modal.errors.username}</div>}
                            </label>
                        </section>
                    </div>
                    <div className='modal-footer'>
                        <button className='negative' onClick={this.props.usersCloseModal}>Cancel</button>
                        {this.props.users.modal.status === 'loading' ? <button>loading</button> : <button className='positive' onClick={this.handleEditUsername}>Save</button>}
                    </div>
                </div>
            case 'edit-password':
                return <div className='modal-inner'>
                    <div className='modal-header'>
                        <div className='title'>Edit password</div>
                    </div>
                    <div className='modal-essence'>
                        <section>
                            <div className='info'>Please type in a new password in the field below</div>
                        </section>
                        <section className={this.props.users.modal.errors.password.length > 0 ? 'error' : ''}>
                            <label className={`box-label`}>Password
                                <div className='password-input'>
                                    <input
                                        className={`box-input`}
                                        type={this.props.users.showPassword ? 'text' : "password"}
                                        onChange={e => this.props.usersEditField({ password: e.target.value })}
                                        onBlur={this.secondValidation}
                                        value={this.props.users.modal.selection.password} />
                                    <div className={`show-password ${this.props.users.showPassword ? 'visible' : ''}`} onClick={this.props.usersTogglePassword}><FontAwesomeIcon icon={this.props.users.showPassword ? faEye : faEyeSlash} size="lg" /></div>
                                </div>
                                {this.props.users.modal.errors.password.length > 0 && <div className='error-text'>{this.props.users.modal.errors.password}</div>}
                            </label>
                        </section>
                    </div>
                    <div className='modal-footer'>
                        <button className='negative' onClick={this.props.usersCloseModal}>Cancel</button>
                        {this.props.users.modal.status === 'loading' ? <button>loading</button> : <button className='positive' onClick={this.handleEditUserPassword}>Save</button>}
                    </div>
                </div>
            case 'remove-user':
                return <div className='modal-inner'>
                    <div className='modal-header'>
                        <div className='title'>Delete user</div>
                    </div>
                    <div className='modal-essence'>
                        <section>
                            <div className='info'>Are you sure you want to delete the user?</div>
                            {this.props.users.modal.errors.username.length > 0 && <div className='error-text'>{this.props.users.modal.errors.username}</div>}
                        </section>
                    </div>
                    <div className='modal-footer'>
                        <button className='negative' onClick={this.props.usersCloseModal}>Cancel</button>
                        {this.props.users.modal.status === 'loading' ? <button>loading</button> : <button className='positive' onClick={this.handleRemoveUser}>Delete</button>}
                    </div>
                </div>
            default:
                return null;
        }
    }
    render = () => {
        return (
            <>
                <div id='main-title'>
                    <div className={`main-title-inner`}>Users</div>
                </div>
                <div id='users'>
                    <div className={`info-box`}>
                        <p>While logging in the desktop app, you need your <strong>Place ID</strong>. Share it with your team!</p>
                        <div>
                            <textarea 
                            value={this.props.auth.user.id} 
                            readOnly={true} 
                            ref={div => this.placeIdTextarea = div} 
                            onFocus={e => e.target.select()}
                            onClick={e => e.target.select()}
                            />
                        </div>
                    </div>
                    <div className={`subtitle`}>
                        <div>
                            <p>Manage the access to the desktop app.</p>
                        </div>
                        <div>
                            <button onClick={() => this.props.usersOpenModal('new-user')} className={`top-button`}>New user</button>
                        </div>
                    </div>
                    <label className={`box-label`}>Search by username
                                <input
                            className={`box-input`}
                            type="text"
                            name="search"
                            onChange={e => this.props.usersEditSearchField(e.target.value)}
                            value={this.props.users.searchValue}
                        />
                    </label>
                    <table className={`all-users`}>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.users.allUsers
                                .filter(user => user.username.includes(this.props.users.searchValue.toLowerCase().trim()) || this.props.users.searchValue.toLowerCase().trim() === '')
                                .sort((a, b) => ('' + a.username).localeCompare(b.username))
                                .map(user => <tr key={user.id}>
                                    <td className={`username`}>{user.username}</td>
                                    <td><button onClick={() => this.props.usersOpenModal('edit-username', user.id)}>Edit username</button></td>
                                    <td><button onClick={() => this.props.usersOpenModal('edit-password')}>Edit password</button></td>
                                    <td><button onClick={() => this.props.usersOpenModal('remove-user', user.id)} className={`remove`}>Delete user</button></td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
                <Modal open={this.props.users.modal.isOpen} onClose={this.props.usersCloseModal}>{this.renderModal()}</Modal>
            </>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    users: state.users
});
const mapDispatchToProps = {
    usersOpenModal,
    usersCloseModal,
    usersEditField,
    usersValidate,
    usersAddNewUser,
    usersTogglePassword,
    usersSetStatus,
    usersEditUsername,
    usersEditPassword,
    usersEditSearchField,
    usersRemoveUser
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Users));
