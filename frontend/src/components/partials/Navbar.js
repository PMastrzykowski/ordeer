import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { setAuthToken } from "../../helpers/auth";
import axios from "axios";
import { api } from "../../api";
import { loginLogoutUser } from "../../actions/login";
import DropdownMenu from "./DropdownMenu";

const Navbar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({
        user: state.user,
    }));
    const logout = async () => {
        try {
            await axios.get(`${api}/api/users/logout`);
            localStorage.removeItem("firstLogin");
            setAuthToken(false);
            dispatch(loginLogoutUser());
        } catch (err) {
            console.log(err);
        }
    };
    const renderDropdown = () => {
        return (
            <ul>
                <NavLink
                    to="settings"
                    className={({ isActive }) =>
                        isActive ? "navbar-button-active" : undefined
                    }
                >
                    <li>Settings</li>
                </NavLink>
                <li onClick={() => logout()}>Logout</li>
            </ul>
        );
    };
    return (
        <div className="profile">
            <nav className="navbar">
                <div className="navbar-left">
                    <Link to="/" id="logo">
                        <div className={"main-logo"} />
                    </Link>
                </div>
                <div className="navbar-right">
                    <NavLink
                        to="cipa"
                        className={({ isActive }) =>
                            isActive ? "navbar-button-active" : undefined
                        }
                    >
                        <button className="navbar-button">Cipa</button>
                    </NavLink>
                    <NavLink
                        to="chuj"
                        className={({ isActive }) =>
                            isActive ? "navbar-button-active" : undefined
                        }
                    >
                        <button className="navbar-button">Chuj</button>
                    </NavLink>
                    <DropdownMenu name={user.name} content={renderDropdown()} />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
