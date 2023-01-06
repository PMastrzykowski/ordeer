import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../partials/Loader";
import Path from "../../partials/Path";
import axios from "axios";
import { api } from "../../../api";
import {
    settingsEditField,
    settingsValidate,
    settingsSetStatus,
    settingsCloseInfoBox,
    settingsOpenInfoBox,
    settingsSetView,
    settingsToggleCurrentPassword,
    settingsReset,
} from "../../../actions/settings";
import { loginLogoutUser } from "../../../actions/login";
import InfoBox from "../../partials/InfoBox";
import Login from "../../auth/Login";
import { setAuthToken } from "../../../helpers/auth";
import { useEffect } from "react";

const DeleteAccountSetting = (props) => {
    const dispatch = useDispatch();
    const { settings, user } = useSelector((state) => ({
        settings: state.settings,
        user: state.user,
    }));
    useEffect(() => {
        dispatchEvent(settingsReset());
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
            passwordCurrent: "",
        };
        let valid = true;
        if (
            settings.fields.passwordCurrent.length < 6 ||
            settings.fields.passwordCurrent.length > 30
        ) {
            errors.passwordCurrent = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        settingsValidate(errors, valid);
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (frontValidation()) {
            settingsSetStatus("loading");
            console.log("submit");
            try {
                const data = {
                    password: settings.fields.passwordCurrent,
                    id: user.id,
                };
                await axios.post(`${api}/api/users/deleteaccount`, data);
                await axios.get(`${api}/api/users/logout`);
                localStorage.removeItem("firstLogin");
                setAuthToken(false);
                dispatch(loginLogoutUser());
            } catch (err) {
                console.log(err);
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
                dispatch(settingsSetStatus("ready"));
            }
        }
    };
    const renderContent = () => {
        switch (settings.view) {
            case "confirm-delete":
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="info">
                            Enter your password to confirm account deletition.
                        </div>
                        <div
                            className={
                                settings.errors.passwordCurrent.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        >
                            <label>
                                <div className="box-label-name">Password</div>
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
                        <div className="buttons-wrapper">
                            <Link to={"/settings"}>
                                <button className="empty" type={"button"}>
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type={
                                    settings.status === "loading" ||
                                    settings.fields.passwordCurrent.length === 0
                                        ? "button"
                                        : "submit"
                                }
                                className={
                                    settings.status === "loading"
                                        ? "button full loading"
                                        : settings.fields.passwordCurrent
                                              .length === 0
                                        ? "disabled"
                                        : "full"
                                }
                                onClick={
                                    settings.status === "loading" ||
                                    settings.fields.passwordCurrent.length === 0
                                        ? null
                                        : handleSubmit
                                }
                            >
                                {settings.status === "loading" ? (
                                    <span className="value">
                                        <Loader />
                                    </span>
                                ) : (
                                    <span className="value">
                                        Confirm delete account
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                );
            default:
                return (
                    <form>
                        <div className="info">
                            Once you delete your account, you won't be able to
                            restore your data.
                        </div>
                        <div className="buttons-wrapper">
                            <Link to={"/settings"}>
                                <button className="empty" type={"button"}>
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type={"button"}
                                className={"full danger"}
                                onClick={() =>
                                    dispatch(settingsSetView("confirm-delete"))
                                }
                            >
                                <span className="value">Delete account</span>
                            </button>
                        </div>
                    </form>
                );
        }
    };
    return (
        <>
            {user.isAuthenticated ? (
                <div className="settings">
                    <div className="details">
                        <Path
                            segments={[
                                { caption: "Settings", to: "/settings" },
                                {
                                    caption: "Delete account",
                                    to: "/settings/delete",
                                },
                            ]}
                        />
                        <h1>Delete account</h1>
                        <InfoBox
                            type={settings.infoBox.type}
                            text={settings.infoBox.text}
                            close={() => dispatch(settingsCloseInfoBox())}
                        />
                        {renderContent()}
                    </div>
                </div>
            ) : (
                <Login />
            )}
        </>
    );
};
export default DeleteAccountSetting;
