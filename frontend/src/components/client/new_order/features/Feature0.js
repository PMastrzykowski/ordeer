import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleCallTheWaiter, updateQrData } from '../../../../actions/newOrder';
import { socket } from '../../../../socket';

class Feature0 extends React.Component {
    callTheWaiter = () => {
        let data = {
            place: this.props.newOrder.placeId,
            point: this.props.newOrder.pointId,
            _id: this.props.newOrder.sessionId,
            feature: this.props.newOrder.pointFeature,
            openDate: this.props.newOrder.openDate,
            closeDate: this.props.newOrder.closeDate,
            column: this.props.newOrder.column
        };
        this.props.toggleCallTheWaiter(data, this.props.newOrder.exists);
    }
    componentDidMount = () => {
        socket.on('updateCallClient', (data) => {
            if (data.source !== socket.id) {
                let payload = {
                    openDate: data.juice.openDate,
                    closeDate: data.juice.closeDate,
                    column: data.juice.column
                }
                this.props.updateQrData(payload);
            }
        });
    }
    render = () => {
        return (
            <div id='feature-0'>
                <div className='header'>
                    <div className='place-name'>{this.props.newOrder.placeName}</div>
                    <div className='point-name'>{this.props.newOrder.pointName}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="115" height="115" viewBox="0 0 115 115">
                    <defs>
                        <filter id="Elipse_127" x="6" y="6" width="109" height="109" filterUnits="userSpaceOnUse">
                            <feOffset dx="3" dy="3" input="SourceAlpha" />
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feFlood floodOpacity="0.153" />
                            <feComposite operator="in" in2="blur" />
                            <feComposite in="SourceGraphic" />
                        </filter>
                        <filter id="Elipse_128" x="0" y="0" width="109" height="109" filterUnits="userSpaceOnUse">
                            <feOffset dx="-3" dy="-3" input="SourceAlpha" />
                            <feGaussianBlur stdDeviation="1.5" result="blur-2" />
                            <feFlood floodColor="#fff" floodOpacity="0.847" />
                            <feComposite operator="in" in2="blur-2" />
                            <feComposite in="SourceGraphic" />
                        </filter>
                        <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                            <stop offset="0" stopColor="#ad1212" />
                            <stop offset="1" stopColor="#700" />
                        </radialGradient>
                        <radialGradient id="radial-gradient-active" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                            <stop offset="0" stopColor="#EDC4C4" />
                            <stop offset="1" stopColor="#FF0000" />
                        </radialGradient>
                        <filter id="Elipse_127-2" x="12.5" y="12.659" width="96" height="96" filterUnits="userSpaceOnUse">
                            <feOffset dx="3" dy="3" input="SourceAlpha" />
                            <feGaussianBlur stdDeviation="3" result="blur-3" />
                            <feFlood floodColor={`${this.props.newOrder.column === 'firstColumn' ? '#E61515' : '#7b3939'}`} />
                            <feComposite operator="in" in2="blur-3" />
                            <feComposite in="SourceGraphic" />
                        </filter>
                        <filter id="Elipse_128-2" x="6.5" y="6.659" width="96" height="96" filterUnits="userSpaceOnUse">
                            <feOffset dx="-3" dy="-3" input="SourceAlpha" />
                            <feGaussianBlur stdDeviation="3" result="blur-4" />
                            <feFlood floodColor="#e5cdcd" floodOpacity="0.847" />
                            <feComposite operator="in" in2="blur-4" />
                            <feComposite in="SourceGraphic" />
                        </filter>
                        <radialGradient id="radial-gradient-3" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                            <stop offset="0" stopColor="#fff" stopOpacity="0.565" />
                            <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="radial-gradient-4" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                            <stop offset="0" stopColor="#fff" />
                            <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="radial-gradient-5" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                            <stop offset="0" stopColor="#fff" stopOpacity="0.29" />
                            <stop offset="1" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <g id="Grupo_291" transform="translate(-130.5 -226.5)">
                        <g id="Grupo_289" transform="translate(-867.918 -329.918)">
                            <g transform="matrix(1, 0, 0, 1, 998.42, 556.42)" filter="url(#Elipse_127)">
                                <circle id="Elipse_127-3" cx="50" cy="50" r="50" transform="translate(7.5 7.5)" fill="#ecf3fb" />
                            </g>
                            <g transform="matrix(1, 0, 0, 1, 998.42, 556.42)" filter="url(#Elipse_128)">
                                <circle id="Elipse_128-3" cx="50" cy="50" r="50" transform="translate(7.5 7.5)" fill="#ecf3fb" />
                            </g>
                        </g>
                        <g id="Grupo_290" transform="translate(-872 -333.841)">
                            <g id="Grupo_259" transform="translate(15.185 15.185)" onClick={this.callTheWaiter}>
                                <g transform="matrix(1, 0, 0, 1, 987.32, 545.16)" filter="url(#Elipse_127-2)">
                                    <circle id="Elipse_127-4" cx="39" cy="39" r="39" transform="translate(18.5 18.66)" fill={`url(#radial-gradient${this.props.newOrder.column === 'firstColumn' ? '-active' : ''})`} />
                                </g>
                                <g transform="matrix(1, 0, 0, 1, 987.32, 545.16)" filter="url(#Elipse_128-2)">
                                    <circle id="Elipse_128-4" cx="39" cy="39" r="39" transform="translate(18.5 18.66)" fill={`url(#radial-gradient${this.props.newOrder.column === 'firstColumn' ? '-active' : ''})`} />
                                </g>
                            </g>
                            <ellipse id="Elipse_129" cx="8" cy="2.5" rx="8" ry="2.5" transform="matrix(0.883, -0.469, 0.469, 0.883, 1065.763, 647.048)" fill="url(#radial-gradient-3)" />
                            <ellipse id="Elipse_130" cx="19" cy="6.5" rx="19" ry="6.5" transform="matrix(0.883, -0.469, 0.469, 0.883, 1026.172, 596.681)" fill="url(#radial-gradient-4)" />
                            <path id="Trazado_193" d="M16.567,0c9.155,0,20.358,7.2,20.358,9.389S27.7,10.876,18.54,10.876,2.071,9.591,2.071,7.4,7.412,0,16.567,0Z" transform="translate(1081.093 587.477) rotate(63)" fill="url(#radial-gradient-5)" />
                        </g>
                    </g>
                </svg>
                <div className='info'>
                    <h3>{this.props.newOrder.column === 'firstColumn' ? ' ' : 'Press the button'}</h3>
                    <h1>{this.props.newOrder.column === 'firstColumn' ? 'The waiter is coming' : 'to call the waiter'}</h1>
                </div>
            </div >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        newOrder: state.newOrder
    }
}
const mapDispatchToProps = dispatch => (
    bindActionCreators({
        toggleCallTheWaiter,
        updateQrData
    },
        dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Feature0);