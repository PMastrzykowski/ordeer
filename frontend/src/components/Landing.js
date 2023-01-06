import { Link } from "react-router-dom";
const Landing = () => (
    <div className="landing">
        <div className="landing-left">
            <div className={"main-logo"} />
        </div>
        <div className="landing-right">
            <Link to="register">
                <button className="contrast">Register</button>
            </Link>
            <Link to="login">
                <button className="empty contrast">Login</button>
            </Link>
        </div>
    </div>
);
export default Landing;
