import { Link } from "react-router-dom";

const Path = (props) => (
    <div className={`path`}>
        {props.segments.map((segment, i) => (
            <div key={i} className={`path-inner`}>
                {i > 0 && <div className={`slash`}>/</div>}
                <Link to={segment.to}>
                    <div className={`path-segment`}>{segment.caption}</div>
                </Link>
            </div>
        ))}
    </div>
);

export default Path;
