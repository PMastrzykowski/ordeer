import React from 'react';
import { connect } from 'react-redux';
import { logoutUser, loginSetManagerData } from '../../actions/login';
import Login from '../auth/Login';
import Wrapper from './Wrapper';


class PreWrapper extends React.Component {
    render = () => {
        return (
            this.props.auth.isAuthenticated ?
                <Wrapper contentType={this.props.contentType}/>
                :
                <Login />
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});
const mapDispatchToProps = {
    logoutUser,
    loginSetManagerData
};
export default connect(mapStateToProps, mapDispatchToProps)(PreWrapper);