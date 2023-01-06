import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Chevron from "../partials/Chevron";
import Login from "../auth/Login";
const Settings = (props) => {
    const { user } = useSelector((state) => ({
        user: state.user,
    }));
    const renderContent = () => {
        let settings = [
            {
                label: "Change name",
                value: user.name,
                to: "name",
            },
            {
                label: "Change email",
                value: user.email,
                to: "email",
            },
            {
                label: "Change password",
                value: "",
                to: "password",
            },
            {
                label: "Payments",
                value: "Manage your payment method and review invoices",
                to: "payments",
            },
            {
                label: "Delete account",
                value: "",
                to: "delete",
            },
        ];
        return (
            <div className="settings">
                <h1>Settings</h1>
                {settings.map((setting) => (
                    <Link to={setting.to} key={setting.label}>
                        <div className="setting">
                            <div className="setting-left">
                                <div className="setting-label">
                                    {setting.label}
                                </div>
                                {setting.value && (
                                    <div className="setting-value">
                                        {setting.value}
                                    </div>
                                )}
                            </div>
                            <div className="setting-right">
                                <Chevron side="right" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };
    return (
        <>
            {user.isAuthenticated ? (
                renderContent()
            ) : (
                <Login />
                // <Navigate to="/" replace={true} />
            )}
        </>
    );
};

export default Settings;
