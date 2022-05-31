import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import SingleSetting from "./SingleSetting";
import Modal from "../partials/Modal";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    settingsOpenModal,
    settingsCloseModal,
    settingsEditField,
    settingsValidate,
    settingsSetStatus,
    settingsToggleCurrentPassword,
    settingsTogglePassword,
} from "../../actions/settings";
import { loginUser, logoutUser } from "../../actions/login";
import { api } from "../../api";

class Settings extends React.Component {
    secondValidation = () => {
        if (!this.props.settings.modal.valid) {
            this.frontValidation();
        }
    };
    frontValidation = () => {
        const validateEmail = (email) => {
            //eslint-disable-next-line
            var re =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        let errors = {
            name: "",
            email: "",
            password: "",
            passwordCurrent: "",
            code: "",
        };
        let valid = true;
        if (
            ["edit-name"].includes(this.props.settings.modal.view) &&
            (this.props.settings.modal.fields.name.length === 0 ||
                this.props.settings.modal.fields.name.length > 20)
        ) {
            errors.name = "Name must be 1 - 20 characters long.";
            valid = false;
        }
        if (
            ["edit-email"].includes(this.props.settings.modal.view) &&
            !validateEmail(this.props.settings.modal.fields.email)
        ) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        if (
            ["edit-password"].includes(this.props.settings.modal.view) &&
            (this.props.settings.modal.fields.password.length < 6 ||
                this.props.settings.modal.fields.password.length > 30)
        ) {
            errors.password = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        if (
            ["edit-email-code"].includes(this.props.settings.modal.view) &&
            this.props.settings.modal.fields.code.length !== 4
        ) {
            errors.code = "Code should contain 4 characters.";
            valid = false;
        }
        if (
            ["edit-email", "edit-password", "remove-account"].includes(
                this.props.settings.modal.view
            ) &&
            (this.props.settings.modal.fields.passwordCurrent.length < 6 ||
                this.props.settings.modal.fields.passwordCurrent.length > 30)
        ) {
            errors.passwordCurrent = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        this.props.settingsValidate(errors, valid);
        return valid;
    };
    handleChangeName = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.settingsSetStatus("loading");
            const data = {
                name: this.props.settings.modal.fields.name,
                id: this.props.auth.user.id,
            };
            axios
                .post(`${api}/api/users/changename`, data)
                .then((res) => {
                    this.props.settingsSetStatus("ready");
                    this.props.settingsOpenModal("edit-name-success");
                    this.props.loginUser(res.data.token);
                })
                .catch((err) => {
                    this.props.settingsValidate(err.response.data, true);
                    this.props.settingsSetStatus("ready");
                });
        }
    };
    handleChangeEmailRequest = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.settingsSetStatus("loading");
            const user = {
                email: this.props.settings.modal.fields.email,
                password: this.props.settings.modal.fields.passwordCurrent,
                id: this.props.auth.user.id,
            };
            axios
                .post(`${api}/api/users/changeemailrequest`, user)
                .then((res) => {
                    this.props.settingsSetStatus("ready");
                    this.props.settingsOpenModal("edit-email-code");
                })
                .catch((err) => {
                    this.props.settingsValidate(err.response.data, true);
                    this.props.settingsSetStatus("ready");
                });
        }
    };
    handleChangeEmail = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.settingsSetStatus("loading");
            const data = {
                code: this.props.settings.modal.fields.code,
                id: this.props.auth.user.id,
            };
            axios
                .post(`${api}/api/users/changeemail`, data)
                .then((res) => {
                    this.props.settingsSetStatus("ready");
                    this.props.settingsOpenModal("edit-email-success");
                    this.props.loginUser(res.data.token);
                })
                .catch((err) => {
                    this.props.settingsValidate(err.response.data, true);
                    this.props.settingsSetStatus("ready");
                });
        }
    };
    handleChangePassword = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.settingsSetStatus("loading");
            const data = {
                password: this.props.settings.modal.fields.passwordCurrent,
                new_password: this.props.settings.modal.fields.password,
                id: this.props.auth.user.id,
            };
            axios
                .post(`${api}/api/users/changepassword`, data)
                .then((res) => {
                    this.props.settingsSetStatus("ready");
                    this.props.settingsOpenModal("edit-password-success");
                })
                .catch((err) => {
                    this.props.settingsValidate(err.response.data, true);
                    this.props.settingsSetStatus("ready");
                });
        }
    };
    handleDeleteAccount = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.settingsSetStatus("loading");
            const data = {
                password: this.props.settings.modal.fields.passwordCurrent,
                id: this.props.auth.user.id,
            };
            axios
                .post(`${api}/api/users/deleteaccount`, data)
                .then((res) => {
                    this.props.logoutUser(this.props.history);
                })
                .catch((err) => {
                    this.props.settingsValidate(err.response.data, true);
                    this.props.settingsSetStatus("ready");
                });
        }
    };
    renderModal = () => {
        switch (this.props.settings.modal.view) {
            case "edit-name":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change name</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    To change name please insert the new value
                                    below. The name must be 1 - 20 characters
                                    long.
                                </div>
                            </section>
                            <section>
                                <label className={`box-label`}>
                                    New name
                                    <input
                                        className={`box-input`}
                                        type="text"
                                        onChange={(e) =>
                                            this.props.settingsEditField({
                                                name: e.target.value,
                                            })
                                        }
                                        onBlur={this.secondValidation}
                                        value={
                                            this.props.settings.modal.fields
                                                .name
                                        }
                                    />
                                    {this.props.settings.modal.errors.name
                                        .length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .name
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Cancel
                            </button>
                            {this.props.settings.modal.status === "loading" ? (
                                <button>loading</button>
                            ) : (
                                <button
                                    className="positive"
                                    onClick={this.handleChangeName}
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    </div>
                );
            case "edit-name-success":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change name</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Name was changed successfully.
                                </div>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                );
            case "edit-email":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change email</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Do you want to remove the menu?
                                </div>
                            </section>
                            <section>
                                <label className={`box-label`}>
                                    New email
                                    <input
                                        className={`box-input`}
                                        type="text"
                                        onChange={(e) =>
                                            this.props.settingsEditField({
                                                email: e.target.value,
                                            })
                                        }
                                        onBlur={this.secondValidation}
                                        value={
                                            this.props.settings.modal.fields
                                                .email
                                        }
                                    />
                                    {this.props.settings.modal.errors.email
                                        .length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .email
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                            <section className={`info-box blue`}>
                                <p>
                                    Please enter your current password for
                                    confirmation.
                                </p>
                                <label className={`box-label`}>
                                    Current password
                                    <div className="password-input">
                                        <input
                                            className={`box-input`}
                                            type={
                                                this.props.settings
                                                    .showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={(e) =>
                                                this.props.settingsEditField({
                                                    passwordCurrent:
                                                        e.target.value,
                                                })
                                            }
                                            onBlur={this.secondValidation}
                                            value={
                                                this.props.settings.modal.fields
                                                    .passwordCurrent
                                            }
                                        />
                                        <div
                                            className={`show-password ${
                                                this.props.settings
                                                    .showCurrentPassword
                                                    ? "visible"
                                                    : ""
                                            }`}
                                            onClick={
                                                this.props
                                                    .settingsToggleCurrentPassword
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    this.props.settings
                                                        .showCurrentPassword
                                                        ? faEye
                                                        : faEyeSlash
                                                }
                                                size="lg"
                                            />
                                        </div>
                                    </div>
                                    {this.props.settings.modal.errors
                                        .passwordCurrent.length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .passwordCurrent
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Cancel
                            </button>
                            {this.props.settings.modal.status === "loading" ? (
                                <button>loading</button>
                            ) : (
                                <button
                                    className="positive"
                                    onClick={this.handleChangeEmailRequest}
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    </div>
                );
            case "edit-email-code":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change email</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Enter the code we have sent to{" "}
                                    {this.props.settings.modal.fields.email}.
                                </div>
                            </section>
                            <section>
                                <label className={`box-label`}>
                                    Code
                                    <input
                                        className={`box-input`}
                                        type="text"
                                        onChange={(e) =>
                                            this.props.settingsEditField({
                                                code: e.target.value,
                                            })
                                        }
                                        onBlur={this.secondValidation}
                                        value={
                                            this.props.settings.modal.fields
                                                .code
                                        }
                                    />
                                    {this.props.settings.modal.errors.code
                                        .length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .code
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Cancel
                            </button>
                            {this.props.settings.modal.status === "loading" ? (
                                <button>loading</button>
                            ) : (
                                <button
                                    className="positive"
                                    onClick={this.handleChangeEmail}
                                >
                                    Validate
                                </button>
                            )}
                        </div>
                    </div>
                );
            case "edit-email-success":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change email</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Email was changed successfully.
                                </div>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                );
            case "edit-password":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change password</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Enter new password in the fields below, then
                                    enter your current password in the last
                                    field to validate your credentials.
                                </div>
                            </section>
                            <section>
                                <label className={`box-label`}>
                                    New password
                                    <div className="password-input">
                                        <input
                                            className={`box-input`}
                                            type={
                                                this.props.settings.showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={(e) =>
                                                this.props.settingsEditField({
                                                    password: e.target.value,
                                                })
                                            }
                                            onBlur={this.secondValidation}
                                            value={
                                                this.props.settings.modal.fields
                                                    .password
                                            }
                                        />
                                        <div
                                            className={`show-password ${
                                                this.props.settings.showPassword
                                                    ? "visible"
                                                    : ""
                                            }`}
                                            onClick={
                                                this.props
                                                    .settingsTogglePassword
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    this.props.settings
                                                        .showPassword
                                                        ? faEye
                                                        : faEyeSlash
                                                }
                                                size="lg"
                                            />
                                        </div>
                                    </div>
                                    {this.props.settings.modal.errors.password
                                        .length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .password
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                            <section className={`info-box blue`}>
                                <p>
                                    Please enter your current password for
                                    confirmation.
                                </p>
                                <label className={`box-label`}>
                                    Current password
                                    <div className="password-input">
                                        <input
                                            className={`box-input`}
                                            type={
                                                this.props.settings
                                                    .showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={(e) =>
                                                this.props.settingsEditField({
                                                    passwordCurrent:
                                                        e.target.value,
                                                })
                                            }
                                            onBlur={this.secondValidation}
                                            value={
                                                this.props.settings.modal.fields
                                                    .passwordCurrent
                                            }
                                        />
                                        <div
                                            className={`show-password ${
                                                this.props.settings
                                                    .showCurrentPassword
                                                    ? "visible"
                                                    : ""
                                            }`}
                                            onClick={
                                                this.props
                                                    .settingsToggleCurrentPassword
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    this.props.settings
                                                        .showCurrentPassword
                                                        ? faEye
                                                        : faEyeSlash
                                                }
                                                size="lg"
                                            />
                                        </div>
                                    </div>
                                    {this.props.settings.modal.errors
                                        .passwordCurrent.length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .passwordCurrent
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Cancel
                            </button>
                            {this.props.settings.modal.status === "loading" ? (
                                <button>loading</button>
                            ) : (
                                <button
                                    className="positive"
                                    onClick={this.handleChangePassword}
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    </div>
                );
            case "edit-password-success":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Change password</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Password was changed successfully.
                                </div>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                );
            case "remove-account":
                return (
                    <div className="modal-inner">
                        <div className="modal-header">
                            <div className="title">Delete account</div>
                        </div>
                        <div className="modal-essence">
                            <section>
                                <div className="info">
                                    Make sure you don’t have any orders awaiting
                                    your action. Paid accounts will not get
                                    refunded. This operation once commited,
                                    can't be undone.
                                </div>
                            </section>
                            <section>
                                <label className={`box-label`}>
                                    Current password
                                    <input
                                        className={`box-input`}
                                        type="password"
                                        onChange={(e) =>
                                            this.props.settingsEditField({
                                                passwordCurrent: e.target.value,
                                            })
                                        }
                                        onBlur={this.secondValidation}
                                        value={
                                            this.props.settings.modal.fields
                                                .passwordCurrent
                                        }
                                    />
                                    {this.props.settings.modal.errors
                                        .passwordCurrent.length > 0 && (
                                        <div className="error-text">
                                            {
                                                this.props.settings.modal.errors
                                                    .passwordCurrent
                                            }
                                        </div>
                                    )}
                                </label>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="negative"
                                onClick={this.props.settingsCloseModal}
                            >
                                Cancel
                            </button>
                            {this.props.settings.modal.status === "loading" ? (
                                <button>loading</button>
                            ) : (
                                <button
                                    className="positive"
                                    onClick={this.handleDeleteAccount}
                                >
                                    Delete account
                                </button>
                            )}
                        </div>
                    </div>
                );
            default:
                return "";
        }
    };
    render = () => {
        let settings = [
            {
                title: "Regional",
                singleSettings: [
                    {
                        title: "Language",
                        value: this.props.auth.user.name,
                        button: "Change",
                        onClick: () =>
                            this.props.settingsOpenModal("edit-name"),
                    },
                    {
                        title: "Currency",
                        value: this.props.auth.user.name,
                        button: "Change",
                        onClick: () =>
                            this.props.settingsOpenModal("edit-name"),
                    }
                ],
            },
            {
                title: "Account",
                singleSettings: [
                    {
                        title: "Name",
                        value: this.props.auth.user.name,
                        button: "Change",
                        onClick: () =>
                            this.props.settingsOpenModal("edit-name"),
                    },
                    {
                        title: "Email",
                        value: this.props.auth.user.email,
                        button: "Change",
                        onClick: () =>
                            this.props.settingsOpenModal("edit-email"),
                    },
                    {
                        title: "Password",
                        value: "password",
                        button: "Change",
                        onClick: () =>
                            this.props.settingsOpenModal("edit-password"),
                    },
                    {
                        title: "Delete account",
                        value: "To delete the account press the button on the right. Make sure you don’t have any orders awaiting your action. Paid accounts will not get refunded.",
                        button: "Delete account",
                        onClick: () =>
                            this.props.settingsOpenModal("remove-account"),
                    },
                ],
            },
        ];
        return (
            <>
                <div id="main-title">
                    <div className={`main-title-inner`}>Access details</div>
                </div>
                <div id="settings">
                    {settings.map((setting, settingIndex) => (
                        <div key={`setting-${settingIndex}`}>
                            <h1>{setting.title}</h1>
                    {setting.singleSettings.map((singleSetting, singleSettingIndex) => (
                        <SingleSetting
                            key={`singlesetting-${singleSettingIndex}`}
                            title={singleSetting.title}
                            value={singleSetting.value}
                            button={singleSetting.button}
                            onClick={singleSetting.onClick}
                        />
                    ))}
                    </div>
                    ))}
                    <Modal
                        open={this.props.settings.modal.isOpen}
                        onClose={this.props.settingsCloseModal}
                    >
                        {this.renderModal()}
                    </Modal>
                </div>
            </>
        );
    };
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    settings: state.settings,
});
const mapDispatchToProps = {
    settingsOpenModal,
    settingsCloseModal,
    settingsEditField,
    settingsValidate,
    settingsSetStatus,
    settingsToggleCurrentPassword,
    settingsTogglePassword,
    loginUser,
    logoutUser,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Settings));
