import React from 'react';
import { TimelineLite } from 'gsap';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLeaving: false,
            isVisible: false,
            mount: false
        }
        this.enter = new TimelineLite();
        this.leave = new TimelineLite();
    }
    onEnter = () => {
        this.enter
            .set(this.modalBackground, { display: 'flex', opacity: 0 })
            .set(this.modalBody, { y: 20 })
            .to(this.modalBackground, 0.3, { opacity: 1 })
            .to(this.modalBody, 0.2, { opacity: 1, y: 0 }, '=-0.3')
            .call(() => {
                this.setState({
                    isLeaving: false
                })
            })
    }
    onLeave = () => {
        if (this.state.isLeaving) {
            return;
        }
        this.setState({
            isLeaving: true
        }, () => {
            this.leave
                .to(this.modalBody, 0.2, { opacity: 0, y: 20 })
                .to(this.modalBackground, 0.3, { opacity: 0 })
                .set(this.modalBackground, { display: 'none' })
                .call(() => {

                })
        })
    }
    shouldComponentUpdate = (nextProps) => {
        if (nextProps.open !== this.props.open || nextProps.children !== this.props.children) {
            return true;
        }
        return false;
    }
    componentDidUpdate = (prevProps) => {
        if (prevProps.open !== this.props.open) {
            if (!prevProps.open) {
                this.onEnter();
            } else {
                this.onLeave();
            }
        }
    }
    render = () => {
        return (<div className='modal-background' ref={div => this.modalBackground = div}>
            <div className='modal-body' ref={div => this.modalBody = div}>
                <div className='close' onClick={() => this.props.onClose()}><div className='icon' /></div>
                {this.props.children}
            </div>
        </div>
        )
    }
}

export default Modal;