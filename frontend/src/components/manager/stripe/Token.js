import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string'
import {
    stripeTokenError,
    stripeSetStripeId
} from '../../../actions/stripe';
import { api } from '../../../api';
class Token extends React.Component {
    componentDidMount = () => {
        const params = queryString.parse(this.props.location.search);
        console.log(params)
        if (params.code && params.state) {
            console.log('inside')
            axios.post(`${api}/api/stripe/token`, { ...params, userId: this.props.auth.user.id })
                .then(res => {
                    if (!res.data.success) {
                        this.props.stripeTokenError()
                    } else {
                        this.props.stripeSetStripeId(res.data.userId);
                        this.props.history.push('/admin/dashboard');
                    }
                })
                .catch(err => {
                    this.props.stripeTokenError()
                });
        } else {
            this.props.stripeTokenError()
        }
    }
    render = () => {
        return (
            this.props.stripe.tokenError ? <div>An error appeared</div> : 
            <div className={`initial-loader`}>
                <div className="cssload-container">
                    <div className="cssload-speeding-wheel"></div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    stripe: state.stripe
});
const mapDispatchToProps = {
    stripeTokenError,
    stripeSetStripeId
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Token));
