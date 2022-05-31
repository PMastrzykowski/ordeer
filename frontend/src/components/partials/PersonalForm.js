import React from "react";
import Select from "react-select";
import axios from "axios";
import { api } from "../../api";
import { allCountries } from "../../helpers/regional";
import { connect } from "react-redux";
import {
    plansPersonalFormValidate,
    plansPersonalFormEditField,
    plansPersonalFormSetStatus,
    plansPersonalFormSetMode,
    plansPersonalFormSave,
    plansPersonalFormStartSubmitting,
    plansPersonalFormStopSubmitting,
} from "../../actions/plans";
class PersonalForm extends React.Component {
    handleInputChange = (e) => {
        this.props.plansPersonalFormEditField({
            [e.target.name]: e.target.value,
        });
    };
    secondValidation = () => {
        if (!this.props.plans.personalForm.valid) {
            this.frontValidation();
        }
    };
    frontValidation = () => {
        const validateEmail = (email) => {
            //eslint-disable-next-line
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        let errors = {
            name: "",
            email: "",
            phoneNumber: "",
            city: "",
            country: "",
            addressLineOne: "",
            addressLineTwo: "",
            postalCode: "",
            state: "",
        };
        let valid = true;
        if (!validateEmail(this.props.plans.personalForm.fields.email)) {
            errors.email = "Email is invalid.";
            valid = false;
        }
        if (this.props.plans.personalForm.fields.name.length === 0) {
            errors.name = "Name is required.";
            valid = false;
        }
        if (this.props.plans.personalForm.fields.city.length === 0) {
            errors.city = "City is required.";
            valid = false;
        }
        if (this.props.plans.personalForm.fields.country.length === 0) {
            errors.country = "Country is required.";
            valid = false;
        }
        if (this.props.plans.personalForm.fields.addressLineOne.length === 0) {
            errors.addressLineOne = "We will need street and home number.";
            valid = false;
        }
        if (this.props.plans.personalForm.fields.postalCode.length === 0) {
            errors.postalCode = "Postal code is required.";
            valid = false;
        }
        this.props.plansPersonalFormValidate(errors, valid);
        return valid;
    };
    submit = async (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.plansPersonalFormStartSubmitting();
            let personalMetadata = {
                name: this.props.plans.personalForm.fields.name,
                email: this.props.plans.personalForm.fields.email,
                phone: this.props.plans.personalForm.fields.phoneNumber,
                address: {
                    city: this.props.plans.personalForm.fields.city,
                    country: this.props.plans.personalForm.fields.country,
                    line1: this.props.plans.personalForm.fields.addressLineOne,
                    line2: this.props.plans.personalForm.fields.addressLineTwo,
                    postal_code: this.props.plans.personalForm.fields
                        .postalCode,
                    state: this.props.plans.personalForm.fields.state,
                },
            };
            const response = await axios.post(
                `${api}/api/stripe/updatepersonalcustomerdetails`,
                {
                    stripeCustomerId: this.props.auth.user.stripeCustomerId,
                    personalMetadata,
                }
            );
            if (response.data.success) {
                console.log("Customer details saved!");
                this.props.plansPersonalFormSave();
                console.log(response);
            } else {
                console.log(response);
                this.props.plansPersonalFormStopSubmitting();
            }
        }
    };
    countryCodeToLabel = (code) => {
        let filteredCountries = allCountries.filter(
            (country) => country.code === code
        );
        return filteredCountries.length > 0
            ? filteredCountries[0]["name_en"]
            : "no country";
    };
    savedPersonalForm = () => {
        return (
            <div className={`personal-form saved`}>
                <section>
                    <h3>Personal information</h3>
                    <div className={`section`}>
                        <label className={`box-label`}>
                            Name
                            <div className={`box-input`}>
                                {this.props.plans.personalForm.saved.name}
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            Email
                            <div className={`box-input`}>
                                {this.props.plans.personalForm.saved.email}
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            Phone number
                            <div className={`box-input`}>
                                {
                                    this.props.plans.personalForm.saved
                                        .phoneNumber
                                }
                            </div>
                        </label>
                    </div>
                </section>
                <section>
                    <h3>Address</h3>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            Country
                            <div className={`box-input`}>
                                {this.countryCodeToLabel(
                                    this.props.plans.personalForm.saved.country
                                )}
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            City
                            <div className={`box-input`}>
                                {this.props.plans.personalForm.saved.city}
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            Address line 1
                            <div className={`box-input`}>
                                {
                                    this.props.plans.personalForm.saved
                                        .addressLineOne
                                }
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            Address line 2
                            <div className={`box-input`}>
                                {
                                    this.props.plans.personalForm.saved
                                        .addressLineTwo
                                }
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            Postal code
                            <div className={`box-input`}>
                                {this.props.plans.personalForm.saved.postalCode}
                            </div>
                        </label>
                    </div>

                    <div className={`section`}>
                        <label className={`box-label`}>
                            State
                            <div className={`box-input`}>
                                {this.props.plans.personalForm.saved.state}
                            </div>
                        </label>
                    </div>
                </section>
                <button
                    className={`pay`}
                    onClick={() => this.props.plansPersonalFormSetMode("edit")}
                >
                    Edit
                </button>
            </div>
        );
    };
    editPersonalForm = () => {
        return (
            <form
                className={`personal-form ${
                    this.props.plans.personalForm.submitting ? "submitting" : ""
                }`}
            >
                <section>
                    <h3>Personal information</h3>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.name.length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Name <span className={`required`}>*</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="name"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields.name
                                }
                            />
                            {this.props.plans.personalForm.errors.name.length >
                                0 && (
                                <div className="error-text">
                                    {this.props.plans.personalForm.errors.name}
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.email.length >
                            0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Email <span className={`required`}>*</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="email"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields.email
                                }
                            />
                            {this.props.plans.personalForm.errors.email.length >
                                0 && (
                                <div className="error-text">
                                    {this.props.plans.personalForm.errors.email}
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.phoneNumber
                                .length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Phone number{" "}
                            <span className={`optional`}>(optional)</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="phoneNumber"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields
                                        .phoneNumber
                                }
                            />
                            {this.props.plans.personalForm.errors.phoneNumber
                                .length > 0 && (
                                <div className="error-text">
                                    {
                                        this.props.plans.personalForm.errors
                                            .phoneNumber
                                    }
                                </div>
                            )}
                        </label>
                    </div>
                </section>
                <section>
                    <h3>Address</h3>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.country
                                .length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Country <span className={`required`}>*</span>
                            <Select
                                defaultValue={{
                                    label: this.countryCodeToLabel(
                                        this.props.plans.personalForm.saved
                                            .country
                                    ),
                                    value: this.props.plans.personalForm.saved
                                        .country,
                                }}
                                isMulti={false}
                                name={""}
                                options={allCountries.map((option) => ({
                                    label: option[`name_en`],
                                    value: option.code,
                                }))}
                                onChange={(e) => {
                                    this.props.plansPersonalFormEditField({
                                        country: e.value,
                                    });
                                    this.secondValidation();
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                            <div className="error-text">
                                {this.props.plans.personalForm.errors.country
                                    .length > 0 && (
                                    <div className="error-text">
                                        {
                                            this.props.plans.personalForm.errors
                                                .country
                                        }
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.city.length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            City <span className={`required`}>*</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="city"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields.city
                                }
                            />
                            {this.props.plans.personalForm.errors.city.length >
                                0 && (
                                <div className="error-text">
                                    {this.props.plans.personalForm.errors.city}
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.addressLineOne
                                .length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Address line 1 <span className={`required`}>*</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="addressLineOne"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields
                                        .addressLineOne
                                }
                            />
                            {this.props.plans.personalForm.errors.addressLineOne
                                .length > 0 && (
                                <div className="error-text">
                                    {
                                        this.props.plans.personalForm.errors
                                            .addressLineOne
                                    }
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.addressLineTwo
                                .length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Address line 2{" "}
                            <span className={`optional`}>(optional)</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="addressLineTwo"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields
                                        .addressLineTwo
                                }
                            />
                            {this.props.plans.personalForm.errors.addressLineTwo
                                .length > 0 && (
                                <div className="error-text">
                                    {
                                        this.props.plans.personalForm.errors
                                            .addressLineTwo
                                    }
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.postalCode
                                .length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Postal code <span className={`required`}>*</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="postalCode"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields
                                        .postalCode
                                }
                            />
                            {this.props.plans.personalForm.errors.postalCode
                                .length > 0 && (
                                <div className="error-text">
                                    {
                                        this.props.plans.personalForm.errors
                                            .postalCode
                                    }
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.personalForm.errors.state.length >
                            0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            State <span className={`required`}>*</span>
                            <input
                                className={`box-input`}
                                type="text"
                                name="state"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={
                                    this.props.plans.personalForm.fields.state
                                }
                            />
                            {this.props.plans.personalForm.errors.state.length >
                                0 && (
                                <div className="error-text">
                                    {this.props.plans.personalForm.errors.state}
                                </div>
                            )}
                        </label>
                    </div>
                </section>
                {/* <div className={`tax-switch`}>
                    <UISwitch
                        checked={this.props.plans.personalForm.isTaxInfoNeeded}
                        onChange={this.props.plansToggleIsTaxInfoNeeded}
                    />{" "}
                    Add tax information
                </div> */}
                {this.props.plans.personalForm.submitting ? (
                    <button className={`pay`}>Saving...</button>
                ) : (
                    <button className={`pay`} onClick={this.submit}>
                        Save
                    </button>
                )}
                <button
                    className={`pay cancel`}
                    onClick={() => this.props.plansPersonalFormSetMode("saved")}
                >
                    Cancel
                </button>
            </form>
        );
    };
    render() {
        switch (this.props.plans.personalForm.mode) {
            case "edit":
                return this.editPersonalForm();
            case "saved":
            default:
                return this.savedPersonalForm();
        }
    }
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    plans: state.plans,
});
const mapDispatchToProps = {
    plansPersonalFormValidate,
    plansPersonalFormEditField,
    plansPersonalFormSetStatus,
    plansPersonalFormSetMode,
    plansPersonalFormSave,
    plansPersonalFormStartSubmitting,
    plansPersonalFormStopSubmitting,
};
export default connect(mapStateToProps, mapDispatchToProps)(PersonalForm);
