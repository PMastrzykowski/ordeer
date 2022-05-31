import React from 'react';

const SingleSetting = (props) =>
    <section 
    className={`settings-section`}>
        <div className='setting'>
            <div className='left'>
                <h3>{props.title}</h3>
                <p>{props.value}</p>
            </div>
            <div className='right'>
                <button onClick={props.onClick}>{props.button}</button>
            </div>
        </div>
    </section>

export default SingleSetting;