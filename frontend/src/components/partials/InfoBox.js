const InfoBox = (props) => (
    <>
        {props.text.length > 0 && (
            <div className={`info-box ${props.type}`}>
                <div className="text">{props.text}</div>
                <div className="close" onClick={props.close}>
                    <div className="close-icon"></div>
                </div>
            </div>
        )}
    </>
);
export default InfoBox;
