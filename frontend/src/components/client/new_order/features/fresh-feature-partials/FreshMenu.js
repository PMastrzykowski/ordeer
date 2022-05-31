import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { updateQrData } from "../../../../../actions/newOrder";
import { Link } from "react-router-dom";
import { calculateTotal } from "../../../../../helpers/freshNewOrder";

class FreshMenu extends React.Component {
    render = () => {
        return null
        // return (
        //     <div id="view-01">
        //         <div className={`view-01-header`}>
        //             <div className={`items-back`}>
        //                 <div className={`back-icon`} />
        //             </div>
        //             <div className={`items-title`}>
        //                 {this.props.newOrder.selectedCategory.name}
        //             </div>
        //         </div>
        //         <div className={`view-01-body`}>
        //             {this.props.newOrder.selectedCategory.items.map(
        //                 (item, itemIndex) => (
        //                     <div
        //                         key={itemIndex}
        //                         className={`menu-list-item ${
        //                             item.available ? "" : "unavailable"
        //                         }`}
        //                     >
        //                         <div className={`item-image`}>
        //                             {item.images.length > 0 && (
        //                                 <div
        //                                     className={`image`}
        //                                     style={{
        //                                         backgroundImage: `url(${item.images[0].url})`,
        //                                     }}
        //                                 />
        //                             )}
        //                         </div>
        //                         <div className={`item-info`}>
        //                             <div className={`item-name`}>
        //                                 {item.name}
        //                             </div>
        //                             <div className={`item-price`}>
        //                                 {item.price} zł
        //                             </div>
        //                         </div>
        //                     </div>
        //                 )
        //             )}
        //         </div>
        //         <div className={`view-01-footer`}>
        //             <div>
        //                 <div className={`label`}>Total</div>
        //                 <div>{calculateTotal()} zł</div>
        //             </div>
        //             <div>
        //                 {this.props.newOrder.cart.length > 0 && (
        //                     <button className={`payment-button`}>
        //                         Checkout
        //                     </button>
        //                 )}
        //             </div>
        //         </div>
        //     </div>
        // );
    };
}
const mapStateToProps = (state) => {
    return {
        newOrder: state.newOrder,
    };
};
const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            updateQrData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(FreshMenu);
