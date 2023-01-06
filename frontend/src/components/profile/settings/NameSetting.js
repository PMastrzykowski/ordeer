import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import Loader from "../../partials/Loader";
import Path from "../../partials/Path";
import axios from "axios";
import { api } from "../../../api";
import {
    settingsEditField,
    settingsValidate,
    settingsSetStatus,
    settingsChangeName,
    settingsCloseInfoBox,
    settingsReset,
} from "../../../actions/settings";
import InfoBox from "../../partials/InfoBox";

const NameSetting = () => {
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
            name: "",
        };
        let valid = true;
        if (
            settings.fields.name.length === 0 ||
            settings.fields.name.length > 20
        ) {
            errors.name = "Name must be 1 - 20 characters long.";
            valid = false;
        }
        dispatch(settingsValidate(errors, valid));
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            frontValidation() &&
            settings.status === "ready" &&
            settings.fields.name !== settings.defaults.name
        ) {
            dispatch(settingsSetStatus("loading"));
            const data = {
                name: settings.fields.name,
                id: user.id,
            };
            try {
                await axios.post(`${api}/api/users/changename`, data);
                console.log(data);
                dispatch(settingsChangeName(data.name));
            } catch (err) {
                console.log(err);
                dispatch(settingsValidate(err.response.data, true));
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
                            { caption: "Name", to: "/settings/name" },
                        ]}
                    />
                    <h1>Name</h1>
                    <InfoBox
                        type={settings.infoBox.type}
                        text={settings.infoBox.text}
                        close={() => dispatch(settingsCloseInfoBox)}
                    />
                    <form onSubmit={handleSubmit}>
                        <div
                            className={
                                settings.errors.name.length > 0
                                    ? "error box-label"
                                    : "box-label"
                            }
                        >
                            <label>
                                <div className="box-label-name">Name</div>
                                <input
                                    className={`box-input`}
                                    type="text"
                                    name="name"
                                    onChange={handleInputChange}
                                    onBlur={secondValidation}
                                    value={settings.fields.name}
                                />
                                <div className="error-text">
                                    {settings.errors.name}
                                </div>
                            </label>
                        </div>
                        <div
                            className={
                                settings.errors.name.length > 0
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
                                        : settings.fields.name ===
                                          settings.defaults.name
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
    return (
        <>
            {user.isAuthenticated ? (
                renderContent()
            ) : (
                <Navigate to="/" replace={true} />
            )}
        </>
    );
};
export default NameSetting;
