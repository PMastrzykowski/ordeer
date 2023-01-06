import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../partials/Loader";
import Path from "../../partials/Path";
import axios from "axios";
import { api } from "../../../api";
import {
    settingsEditField,
    settingsValidate,
    settingsSetStatus,
    settingsOpenInfoBox,
    settingsCloseInfoBox,
    settingsReset,
    settingsToggleCurrentPassword,
    settingsTogglePassword,
} from "../../../actions/settings";
import InfoBox from "../../partials/InfoBox";
import Login from "../../auth/Login";

const PasswordSetting = (props) => {
    const dispatch = useDispatch();
    const { settings, user } = useSelector((state) => ({
        settings: state.settings,
        user: state.user,
    }));
    useEffect(() => {
        dispatch(settingsReset());
    }, []);
    const handleInputChange = (e) => {
        dispatch(settingsEditField({ [e.target.name]: e.target.value }));
    };
    const secondValidation = () => {
        if (!settings.valid) {
            frontValidation();
        }
    };
    const frontValidation = () => {
        let errors = {
            password: "",
        };
        let valid = true;
        if (
            settings.fields.password.length < 6 ||
            settings.fields.password.length > 30
        ) {
            errors.password = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        dispatch(settingsValidate(errors, valid));
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            settings.status === "ready" &&
            settings.fields.password.length > 0 &&
            settings.fields.passwordCurrent.length > 0 &&
            frontValidation()
        ) {
            dispatch(settingsSetStatus("loading"));
            try {
                const data = {
                    newPassword: settings.fields.password,
                    currentPassword: settings.fields.passwordCurrent,
                    id: user.id,
                };
                await axios.post(`${api}/api/users/changepassword`, data);
                dispatch(settingsReset());
                dispatch(
                    settingsOpenInfoBox({
                        type: "success",
                        text: "Password successfully changed.",
                    })
                );
            } catch (err) {
                console.log(err);
                dispatch(settingsSetStatus("ready"));
                if (err.response.data.msg) {
                    dispatch(
                        settingsOpenInfoBox({
                            type: "fail",
                            text: err.response.data.msg,
                        })
                    );
                } else {
                    dispatch(settingsValidate(err.response.data, true));
                }
            }
        }
    };
    const renderContent = () => {
        return (
            <div className="settings">
                <div className="details">
                    <Path
                        segments={[
                            { caption: "Settings", to: "/settings" },
                            {
                                caption: "Change password",
                                to: "/settings/password",
                            },
                        ]}
                    />
                    <h1>Change Password</h1>
                    <InfoBox
                        type={settings.infoBox.type}
                        text={settings.infoBox.text}
                        close={() => dispatch(settingsCloseInfoBox())}
                    />
                    <form onSubmit={handleSubmit}>
                        <div
                            className={
                                settings.errors.password.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        >
                            <label>
                                <div className="box-label-name">
                                    New password
                                </div>
                                <div className="password-input">
                                    <input
                                        className={`box-input`}
                                        type={
                                            settings.showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        onChange={handleInputChange}
                                        onBlur={secondValidation}
                                        value={settings.fields.password}
                                    />
                                    <div
                                        className={`show-password ${
                                            settings.showPassword
                                                ? "visible"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            dispatch(settingsTogglePassword())
                                        }
                                    ></div>
                                </div>
                                <div className="error-text">
                                    {settings.errors.password}
                                </div>
                            </label>
                        </div>

                        <div
                            className={
                                settings.errors.passwordCurrent.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        >
                            <label>
                                <div className="box-label-name">
                                    Current password
                                </div>
                                <div className="password-input">
                                    <input
                                        className={`box-input`}
                                        type={
                                            settings.showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="passwordCurrent"
                                        onChange={handleInputChange}
                                        onBlur={secondValidation}
                                        value={settings.fields.passwordCurrent}
                                    />
                                    <div
                                        className={`show-password ${
                                            settings.showCurrentPassword
                                                ? "visible"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            dispatch(
                                                settingsToggleCurrentPassword()
                                            )
                                        }
                                    ></div>
                                </div>
                                <div className="error-text">
                                    {settings.errors.passwordCurrent}
                                </div>
                            </label>
                        </div>
                        <div
                            className={
                                settings.errors.passwordCurrent.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        ></div>
                        <div className="buttons-wrapper">
                            <Link to={"/settings"}>
                                <button className="empty" type={"button"}>
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type={
                                    settings.status === "loading"
                                        ? "button"
                                        : "submit"
                                }
                                className={
                                    settings.status === "loading"
                                        ? "button full loading"
                                        : settings.fields.password.length ===
                                              0 ||
                                          settings.fields.passwordCurrent
                                              .length === 0
                                        ? "disabled"
                                        : "full"
                                }
                                onClick={
                                    settings.status === "loading"
                                        ? null
                                        : handleSubmit
                                }
                            >
                                {settings.status === "loading" ? (
                                    <span className="value">
                                        <Loader />
                                    </span>
                                ) : (
                                    <span className="value">Save</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };
    return <>{user.isAuthenticated ? renderContent() : <Login />}</>;
};

export default PasswordSetting;
