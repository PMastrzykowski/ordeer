import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import moment from 'moment';
import {
    stripeStartLoading,
    stripeStopLoading,
    stripeSuccessfulPayout,
    stripePayoutLoading,
    stripeInitValidate,
    stripeInitChange
} from '../../actions/stripe';
import { allCountries } from '../../helpers/regional';
import { api } from '../../api';
import Loader from '../partials/Loader';

class Dashboard extends React.Component {
    expressDashboard = (tab = '') => {
        axios.post(`${api}/api/stripe/account`, { stripeId: this.props.auth.user.stripeId, tab })
            .then(res => {
                if (res.data.success) {
                    window.location = res.data.url;
                } else {
                    console.log(res.data)
                }
            })
            .catch(err => {
            });
    }
    secondValidation = () => {
        if (!this.props.stripe.init.valid) {
            this.frontValidation()
        }
    }
    frontValidation = () => {
        let errors = {
            business_name: '',
            first_name: '',
            last_name: '',
            country: ''
        };
        let valid = true;
        if (this.props.stripe.init.fields.business_name.length === 0) {
            errors.business_name = 'Business name is required.';
            valid = false;
        }
        if (this.props.stripe.init.fields.first_name.length === 0) {
            errors.first_name = 'First name is required.';
            valid = false;
        }
        if (this.props.stripe.init.fields.last_name.length === 0) {
            errors.last_name = 'Last name is required.';
            valid = false;
        }
        if (this.props.stripe.init.fields.country.length === 0) {
            errors.country = 'Country name is required.';
            valid = false;
        }
        this.props.stripeInitValidate(errors, valid);
        return valid;
    }
    expressSetupAuthorize = (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.stripePayoutLoading();
            let data = {
                business_type: 'company',
                business_name: this.props.stripe.init.fields.business_name,
                first_name: this.props.stripe.init.fields.first_name,
                last_name: this.props.stripe.init.fields.last_name,
                email: this.props.auth.user.email,
                country: this.props.stripe.init.fields.country
            }
            axios.post(`${api}/api/stripe/authorize`, data)
                .then(res => {
                    window.location = res.data;
                })
                .catch(err => {
                });
        }
    }
    handlePayout = () => {
        if (this.props.stripe.balance.available[0].amount > 0) {
            this.props.stripePayoutLoading();
            axios.post(`${api}/api/stripe/payout`, { stripeId: this.props.auth.user.stripeId })
                .then(res => {
                    if (res.data.success) {
                        this.props.stripeSuccessfulPayout()
                    } else {
                        console.log(res.data)
                    }
                })
        }
    }
    renderContent = () => {
        let inputs = [
            {
                label: 'Company name',
                id: 'companyName',
                value: this.props.stripe.init.fields.business_name,
                onChange: e => this.props.stripeInitChange({ business_name: e.target.value }),
                error: this.props.stripe.init.errors.business_name
            },
            {
                label: 'First name',
                id: 'firstName',
                value: this.props.stripe.init.fields.first_name,
                onChange: e => this.props.stripeInitChange({ first_name: e.target.value }),
                error: this.props.stripe.init.errors.first_name
            },
            {
                label: 'Last name',
                id: 'lastName',
                value: this.props.stripe.init.fields.last_name,
                onChange: e => this.props.stripeInitChange({ last_name: e.target.value }),
                error: this.props.stripe.init.errors.last_name
            }
        ]
        switch (true) {
            case this.props.stripe.loading:
                return <div className={'dahboard-loading'}>
                    <Loader />
                </div>;
            case !this.props.stripe.account:
                return <div>
                    <div>Start earning money</div>
                    <p>To start selling your products, click the button below. You will be redirected to our Payment partner - Stripe. Please provide us with your data necessary to process your payments.</p>
                    <div className={`stripe-init-form`}>
                        <form onSubmit={this.props.stripe.payOutLoading ? null : this.expressSetupAuthorize}>
                            {inputs.map(item => <section key={item.id} className={item.error.length > 0 ? 'error' : ''}>
                                <label className={`box-label`}>{item.label}
                                    <input
                                        className={`box-input`}
                                        type='text'
                                        onChange={item.onChange}
                                        onBlur={this.secondValidation}
                                        value={item.value} />
                                    {item.error.length > 0 && <div className='error-text'>{item.error}</div>}
                                </label>
                            </section>)}
                            <section className={this.props.stripe.init.errors.country.length > 0 ? 'error' : ''}>
                                <label className={`box-label`}>Country
                            <Select
                                        defaultValue={{ label: '', value: '' }}
                                        isMulti={false}
                                        name={''}
                                        options={allCountries.map(option => ({ label: option[`name_en`], value: option.code }))}
                                        onChange={e => {
                                            this.props.stripeInitChange({ country: e.value })
                                            this.secondValidation();
                                        }
                                        }
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                    <div className='error-text'>{this.props.stripe.init.errors.country}</div>
                                </label>
                            </section>
                            <div className={`stripe-init-button`}>
                                <input
                                    type='submit'
                                    onClick={this.props.stripe.payOutLoading ? null : this.expressSetupAuthorize}
                                    value={this.props.stripe.payOutLoading ? 'Loading...' : `Start`} />
                            </div>
                        </form>
                    </div>
                </div>;
            default:
                return <div>
                    {this.props.stripe.account.requirements.currently_due.length > 0 &&
                        <div className={`info-box`}>
                            <p>There are some information lacking to complete your account verification.</p>
                            <button
                                onClick={() => this.expressDashboard('#/account/verify')}>
                                Verify
                        </button>
                        </div>}
                    <div className={`balance-data`}>
                        <div className={`balance-data-left`}>
                            <div className={`balance-data-set`}>
                                <div className={`line-small top`}>
                                    With us since {moment(this.props.auth.user.date).format('MMM YYYY')}
                                </div>
                                <div className={`line-medium`}>
                                    {this.props.auth.user.name}
                                </div>
                                <div className={`line-small link bottom`}>
                                    <span
                                        onClick={() => this.expressDashboard('#/account')}>
                                        View Stripe account
                            </span>
                                </div>
                            </div>
                        </div>
                        <div className={`balance-data-right`}>
                            <div className={`balance-data-set`}>
                                <div className={`line-small top`}>
                                    Your balance
                                </div>
                                <div className={`line-medium`}>
                                    {((this.props.stripe.balance.available[0].amount + this.props.stripe.balance.pending[0].amount) / 100).toFixed(2)} <span className={`currency`}>{this.props.stripe.balance.available[0].currency}</span>
                                </div>
                                <div className={`line-small light bottom`}>
                                    {(this.props.stripe.balance.available[0].amount / 100).toFixed(2)} <span className={`currency`}>{this.props.stripe.balance.available[0].currency}</span> available
                                </div>
                            </div>
                            <div className={`balance-data-set center`}>
                                <div className={`line-big`}>
                                    <button onClick={this.handlePayout}
                                        disabled={this.props.stripe.balance.available[0].amount === 0}>
                                        Pay out now
                                    </button>
                                </div>
                                <div className={`line-small link bottom`}>
                                    <span
                                        onClick={() => this.expressDashboard('')}>
                                        View payouts on Stripe
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2>Recent orders</h2>
                    <div className={`recent-orders`}>
                        <p>No orders to display yet</p>
                    </div>
                </div>
        }
    }
    render = () => {
        return (
            <>
                <div id='main-title'>
                    <div className={`main-title-inner`}>Dashboard</div>
                </div>
                <div id='dashboard'>
                    {this.renderContent()}
                </div>
            </>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    stripe: state.stripe
});
const mapDispatchToProps = {
    stripeStartLoading,
    stripeStopLoading,
    stripeSuccessfulPayout,
    stripePayoutLoading,
    stripeInitValidate,
    stripeInitChange
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Dashboard));
