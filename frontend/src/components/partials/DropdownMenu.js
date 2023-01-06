import Chevron from "./Chevron";

const DropdownMenu = (props) => (
    <div className="dropdown-menu">
        <div className="dropdown-label">
            <div className="dropdown-name">{props.name}</div>
            <div className="dropdown-chevron-icon">
                <Chevron side={"bottom"} />
            </div>
            <div className="dropdown-options-wrapper">
                <div className="dropdown-options">{props.content}</div>
            </div>
        </div>
    </div>
);
export default DropdownMenu;
