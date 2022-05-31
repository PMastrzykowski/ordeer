import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { newOrderToggleOptionMultiple } from "../../../../../actions/newOrder";
import * as currency from "currency.js"
import {currencyOptions} from "../../../../../helpers/regional"
class OptionMany extends React.Component {
    render = () => (
        <div className={`special-field ${this.props.field.type}`}>
            <div className={`special-field-name`}>{this.props.field.name}</div>
            <div className={`special-field-options`}>
                {this.props.field.options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() =>
                            this.props.newOrderToggleOptionMultiple(
                                this.props.field.id,
                                option.id
                            )
                        }
                        className={`special-field-option ${
                            option.value ? "active" : ""
                        }`}
                    >
                        <div className={`checkbox`}>
                            <div className={`checkbox-tick`} />
                        </div>
                        <div className={`option-name`}>{option.name}</div>
                        {option.priceImpact !== 0 && (
                            <div className={`option-price-impact`}>
                                {option.priceImpact > 0 ? "( + " : "( - "}
                                {currency(
                                    option.priceImpact,
                                    currencyOptions(this.props.newOrder.currency)
                                ).format()}{" "}
                                )
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
const mapStateToProps = (state) => {
    return {
        newOrder: state.newOrder
    };
};
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            newOrderToggleOptionMultiple,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(OptionMany);
