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
    settingsCloseInfoBox,
    settingsOpenInfoBox,
    settingsSetView,
    settingsToggleCurrentPassword,
    settingsReset,
    settingsChangeEmail,
} from "../../../actions/settings";
import InfoBox from "../../partials/InfoBox";
import CodeInput from "../../partials/CodeInput";
import Login from "../../auth/Login";
import { useEffect } from "react";
import { validateEmail } from "../../../helpers/utils";

const EmailSetting = (props) => {
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
            email: "",
            passwordCurrent: "",
            code: "",
        };
        let valid = true;
        if (!validateEmail(settings.fields.email)) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        if (
            ["edit-edit-email-code"].includes(settings.view) &&
            settings.fields.code.length !== 4
        ) {
            errors.code = "Code should contain 4 characters.";
            valid = false;
        }
        if (
            settings.fields.passwordCurrent.length < 6 ||
            settings.fields.passwordCurrent.length > 30
        ) {
            errors.passwordCurrent = "Password must be 6 - 30 characters long.";
            valid = false;
        }
        dispatch(settingsValidate(errors, valid));
        return valid;
    };
    const handleChangeEmailRequest = async (e) => {
        e.preventDefault();
        if (
            frontValidation() &&
            settings.status === "ready" &&
            settings.fields.email !== settings.defaults.email
        ) {
            settingsSetStatus("loading");
            try {
                const data = {
                    email: settings.fields.email,
                    password: settings.fields.passwordCurrent,
                    id: user.id,
                };
                const res = await axios.post(
                    `${api}/api/users/changeemailrequest`,
                    data
                );
                dispatch(settingsSetStatus("ready"));
                dispatch(settingsSetView("edit-email-code"));
                console.log(1);
                console.log(res);
            } catch (err) {
                console.log(2);
                console.log(err);
                if (err.response.data.msg) {
                    dispatch(
                        settingsOpenInfoBox({
                            type: "fail",
                            text: err.response.data.msg,
                        })
                    );
                } else {
                    dispatch(settingsValidate(err.response.data, false));
                }
                dispatch(settingsSetStatus("ready"));
            }
        }
    };
    const handleChangeEmail = async (e) => {
        e.preventDefault();
        if (
            frontValidation() &&
            settings.status === "ready" &&
            settings.fields.code.length === 4
        ) {
            dispatch(settingsSetStatus("loading"));
            console.log("submit");
            try {
                const data = {
                    code: settings.fields.code.toUpperCase(),
                    id: user.id,
                };
                await axios.post(`${api}/api/users/changeemail`, data);
                dispatch(settingsChangeEmail(settings.fields.email));
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
            case "edit-email-code":
                return (
                    <form onSubmit={handleChangeEmail}>
                        <div className="info">
                            Enter the code we have sent to{" "}
                            {settings.fields.email}.
                        </div>
                        <div
                            className={
                                settings.errors.code.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        >
                            <label>
                                <div className="box-label-name">Code</div>
                                <CodeInput
                                    size={4}
                                    className={`box-input`}
                                    type="text"
                                    name="code"
                                    onChange={(e) => {
                                        dispatch(
                                            settingsEditField({
                                                code: e,
                                            })
                                        );
                                    }}
                                    onBlur={secondValidation}
                                    value={settings.fields.code}
                                />
                                <div className="error-text">
                                    {settings.errors.code}
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
                                    settings.fields.code.length < 4
                                        ? "button"
                                        : "submit"
                                }
                                className={
                                    settings.status === "loading"
                                        ? "button full loading"
                                        : settings.fields.code.length < 4
                                        ? "disabled"
                                        : "full"
                                }
                                onClick={
                                    settings.status === "loading" ||
                                    settings.fields.code.length < 4
                                        ? null
                                        : handleChangeEmail
                                }
                            >
                                {settings.status === "loading" ? (
                                    <span className="value">
                                        <Loader />
                                    </span>
                                ) : (
                                    <span className="value">Change email</span>
                                )}
                            </button>
                        </div>
                    </form>
                );
            default:
                return (
                    <form
                        onSubmit={
                            settings.view === "edit-email-code"
                                ? handleChangeEmail
                                : handleChangeEmailRequest
                        }
                    >
                        <div
                            className={
                                settings.errors.email.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        >
                            <label>
                                <div className="box-label-name">New email</div>
                                <input
                                    className={`box-input`}
                                    type="email"
                                    name="email"
                                    onChange={handleInputChange}
                                    onBlur={secondValidation}
                                    value={settings.fields.email}
                                />
                                <div className="error-text">
                                    {settings.errors.email}
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
                        <div className="buttons-wrapper">
                            <Link to={"/settings"}>
                                <button className="empty" type={"button"}>
                                    Cancel
                                </button>
                            </Link>
                            <button
                                type={
                                    settings.status === "loading" ||
                                    settings.fields.email ===
                                        settings.defaults.email
                                        ? "button"
                                        : "submit"
                                }
                                className={
                                    settings.status === "loading"
                                        ? "button full loading"
                                        : settings.fields.email ===
                                          settings.defaults.email
                                        ? "disabled"
                                        : "full"
                                }
                                onClick={
                                    settings.status === "loading" ||
                                    settings.fields.email ===
                                        settings.defaults.email
                                        ? null
                                        : handleChangeEmailRequest
                                }
                            >
                                {settings.status === "loading" ? (
                                    <span className="value">
                                        <Loader />
                                    </span>
                                ) : (
                                    <span className="value">
                                        Request email change
                                    </span>
                                )}
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
                                    caption: "Change email",
                                    to: "/settings/email",
                                },
                            ]}
                        />
                        <h1>Change email</h1>
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
export default EmailSetting;
