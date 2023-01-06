import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
// Components
import Register from "./auth/Register";
import Login from "./auth/Login";
import Forgot from "./auth/Forgot";
import Activate from "./auth/Activate";
import NameSetting from "./profile/settings/NameSetting";
import { loginLoginUser, loginLogoutUser } from "../actions/login";
import Reset from "./auth/Reset";
import Landing from "./Landing";
import Navbar from "./partials/Navbar";
import Settings from "./profile/Settings";
import { getData, getToken } from "../helpers/auth";
import EmailSetting from "./profile/settings/EmailSetting";
import { setAuthToken } from "../helpers/auth";
import PasswordSetting from "./profile/settings/PasswordSetting";
import DeleteAccountSetting from "./profile/settings/DeleteAccountSetting";

const RouterComponent = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const isAuthChecked = useRef(false);

    useEffect(() => {
        const firstLogin = localStorage.getItem("firstLogin");
        if (firstLogin && !isAuthChecked.current) {
            isAuthChecked.current = true;
            const getToken = async () => {
                const userData = await getData();
                if (userData.success) {
                    dispatch(loginLoginUser(userData.user.data));
                } else {
                    localStorage.removeItem("firstLogin");
                    setAuthToken(false);
                    dispatch(loginLogoutUser());
                }
            };
            getToken();
        }
    }, []);
    useEffect(() => {
        const responseIntercept = async (err) => {
            const prevRequest = err.config;
            if (err.response.status === 403 && !prevRequest?.sent) {
                try {
                    prevRequest.sent = true;
                    const tokenData = await getToken();
                    prevRequest.headers["Authorization"] = tokenData.token;
                    if (!tokenData.success) {
                        localStorage.removeItem("firstLogin");
                        setAuthToken(false);
                        dispatch(loginLogoutUser());
                    }
                    return axios(prevRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }
            return Promise.reject(err);
        };
        if (user.isAuthenticated) {
            console.log("Interceptor in use");
            axios.interceptors.response.use(null, responseIntercept);
        } else {
            console.log("Interceptor ejected");
            axios.interceptors.response.eject(null, responseIntercept);
        }
    }, [user.isAuthenticated]);
    return (
        <>
            {user.isAuthenticated ? <Navbar /> : null}
            <Routes>
                <Route
                    path="/"
                    element={
                        user.isAuthenticated ? (
                            <div>Dashboard</div>
                        ) : (
                            <Landing />
                        )
                    }
                />
                <Route
                    path="register"
                    element={
                        user.isAuthenticated ? (
                            <Landing />
                        ) : (
                            <Register navigate={navigate} />
                        )
                    }
                />
                <Route path="reset">
                    <Route
                        path=":id"
                        element={
                            <Reset location={location} navigate={navigate} />
                        }
                    />
                </Route>
                <Route path="login" element={<Login navigate={navigate} />} />
                <Route path="forgot" element={<Forgot />} />
                <Route path="settings/name" element={<NameSetting />} />
                <Route path="settings/email" element={<EmailSetting />} />
                <Route path="settings/password" element={<PasswordSetting />} />
                <Route
                    path="settings/delete"
                    element={<DeleteAccountSetting />}
                />
                <Route path="settings" element={<Settings />} />
                <Route path="activate">
                    <Route
                        path=":id"
                        element={
                            user.isAuthenticated ? (
                                <Landing />
                            ) : (
                                <Activate
                                    location={location}
                                    navigate={navigate}
                                />
                            )
                        }
                    />
                </Route>
            </Routes>
        </>
    );
};
export default RouterComponent;
