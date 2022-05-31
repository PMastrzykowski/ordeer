import React from 'react';

const Switch = (props) => 
<div className={`switch-wrapper ${props.checked?'checked':''}`} onClick={props.onChange}>
    <div className='switch'>
        <div className='switch-button'>
            <div className='dott-wrapper'>
                <div className='dott' />
                <div className='dott' />
                <div className='dott' />
                <div className='dott' />
            </div>
        </div>
    </div>
</div>

export default Switch;