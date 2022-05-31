import React from "react";
import Select from "react-select";
import axios from "axios";
import { connect } from "react-redux";
import { taxCodes } from "../../helpers/tax_codes";
import { api } from "../../api";
import {
    plansTaxFormValidate,
    plansTaxFormEditField,
    plansTaxFormSetStatus,
    plansTaxFormSetMode,
    plansTaxFormSave,
    plansTaxFormStartSubmitting,
    plansTaxFormStopSubmitting
} from "../../actions/plans";
class TaxForm extends React.Component {
    handleInputChange = (e) => {
        this.props.plansTaxFormEditField({
            [e.target.name]: e.target.value,
        });
    };
    secondValidation = () => {
        if (!this.props.plans.taxForm.valid) {
            this.frontValidation();
        }
    };
    frontValidation = () => {
        let errors = {
            taxIdCountry: "",
            taxId: "",
        };
        let valid = true;
        if (
            this.props.plans.taxForm.fields.taxId.length === 0
        ) {
            errors.taxId =
                'You decided to provide Tax ID. If it\'s not necessary, please turn "Add tax information" the switch off.';
            valid = false;
        }
        if (
            this.props.plans.taxForm.fields.taxId.length > 0 &&
            this.props.plans.taxForm.fields.taxIdCountry.length === 0
        ) {
            errors.taxIdCountry =
                "Please select tax country for provided tax id number.";
            valid = false;
        }
        this.props.plansTaxFormValidate(errors, valid);
        return valid;
    };
    submit = async (e) => {
        e.preventDefault();
        if (this.frontValidation()) {
            this.props.plansTaxFormStartSubmitting()
            let taxMetadata = {
                type: this.props.plans.taxForm.fields.taxIdCountry,
                value: this.props.plans.taxForm.fields.taxId
            };
            console.log(taxMetadata);
            const response = await axios.post(
                `${api}/api/stripe/settaxcustomerdetails`,
                {
                    stripeCustomerId: this.props.auth.user.stripeCustomerId,
                    taxMetadata,
                }
            );
            if (response.data.success) {
                console.log("Customer tax details saved!");
                this.props.plansTaxFormSave();
                console.log(response);
            } else {
                console.log(response);
                this.props.plansTaxFormValidate({taxId: 'Invalid tax number.'}, false);
                this.props.plansTaxFormStopSubmitting();
            }
        }
    };
    taxCountrySelector = (taxCountry, countryCode) => {
        let filteredCountries = taxCodes.filter(
            (country) => (country.value === taxCountry && country.code === countryCode)
        );
        return filteredCountries.length > 0
            ? filteredCountries[0].label
            : "no country";
    }
    savedTaxForm = () => {
        return (
            <div className={`tax-form`}>
                <section>
                    <h3>Tax information</h3>
                    <div className={`section`}>
                        <label className={`box-label`}>
                            Tax country
                            <div className={`box-input`}>
                                {this.props.plans.taxForm.fields.taxIdCountry}
                            </div>
                        </label>
                    </div>
                    <div className={`section`}>
                        <label className={`box-label`}>
                            Tax ID
                            <div className={`box-input`}>
                                {this.props.plans.taxForm.fields.taxId}
                            </div>
                        </label>
                    </div>
                </section>
                <button
                    className={`pay`}
                    onClick={() => this.props.plansTaxFormSetMode("edit")}
                >
                    Edit
                </button>
            </div>
        );
    };
    editTaxForm = () => {
        return (
            <form className={`tax-form`}>
                <section>
                    <h3>Tax information</h3>
                    <div
                        className={`section ${
                            this.props.plans.taxForm.errors.taxIdCountry
                                .length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Tax country
                            <Select
                                defaultValue={{
                                    label: this.taxCountrySelector(
                                        this.props.plans.taxForm.fields
                                            .taxIdCountry,
                                        this.props.plans.taxForm.fields
                                            .taxIdCountryCode
                                    ),
                                    value: this.props.plans.taxForm.fields
                                        .taxIdCountry,
                                    code: this.props.plans.taxForm.fields
                                        .taxIdCountryCode,
                                }}
                                isMulti={false}
                                name={""}
                                options={taxCodes}
                                onChange={(e) => {
                                    console.log(e);
                                    this.props.plansTaxFormEditField({
                                        taxIdCountry: e.value,
                                        taxIdCountryCode: e.code,
                                    });
                                }}
                                className="basic-multi-select"
                                classNamePrefix="select"
                            />
                            {this.props.plans.taxForm.errors.taxIdCountry
                                .length > 0 && (
                                <div className="error-text">
                                    {
                                        this.props.plans.taxForm.errors
                                            .taxIdCountry
                                    }
                                </div>
                            )}
                        </label>
                    </div>
                    <div
                        className={`section ${
                            this.props.plans.taxForm.errors.taxId.length > 0
                                ? "error"
                                : ""
                        }`}
                    >
                        <label className={`box-label`}>
                            Tax ID
                            <input
                                className={`box-input`}
                                type="text"
                                name="taxId"
                                onChange={this.handleInputChange}
                                onBlur={this.secondValidation}
                                value={this.props.plans.taxForm.fields.taxId}
                            />
                            {this.props.plans.taxForm.errors.taxId.length >
                                0 && (
                                <div className="error-text">
                                    {this.props.plans.taxForm.errors.taxId}
                                </div>
                            )}
                        </label>
                    </div>
                </section>
                {this.props.plans.taxForm.submitting ? (
                    <button className={`pay`}>Saving...</button>
                ) : (
                    <button
                        className={`pay`}
                        onClick={this.submit}
                    >
                        Save
                    </button>
                )}
                <button
                    className={`pay cancel`}
                    onClick={() => this.props.plansTaxFormSetMode("saved")}
                >
                    Cancel
                </button>
            </form>
        );
    };
    render() {
        switch (this.props.plans.taxForm.mode) {
            case "edit":
                return this.editTaxForm();
            case "saved":
            default:
                return this.savedTaxForm();
        }
    }
}
const mapStateToProps = (state) => ({
    auth: state.auth,
    plans: state.plans,
});
const mapDispatchToProps = {
    plansTaxFormValidate,
    plansTaxFormEditField,
    plansTaxFormSetStatus,
    plansTaxFormSetMode,
    plansTaxFormSave,
    plansTaxFormStartSubmitting,
    plansTaxFormStopSubmitting
};
export default connect(mapStateToProps, mapDispatchToProps)(TaxForm);
