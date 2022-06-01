// import React from "react";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
// import {
//     newOrderStartPaying,
//     newOrderStopPaying,
//     newOrderSetErrors,
// } from "../../../../../actions/newOrder";
// import { PaymentRequestButtonElement, injectStripe } from "@stripe/react-stripe-js";
// class PaymentButton extends React.Component {
//     handleChange = ({ error }) => {
//         if (error) {
//             this.props.newOrderSetErrors({ card: error.message });
//         } else {
//             this.props.newOrderSetErrors({ card: "" });
//         }
//     };
//     handleSubmit = (evt) => {
//         evt.preventDefault();
//         this.props.newOrderStartPaying();
//         if (this.props.stripe) {
//             // const cardElement = this.props.elements.getElement(CardElement);
//             // this.props.handleResult(cardElement, this.props.stripe);
//         } else {
//             console.log("Stripe.js hasn't loaded yet.");
//             this.props.newOrderStopPaying();
//         }
//     };
//     componentDidMount=()=>{
//         console.log(this.props)
//     }
//     render  =() => {
//         // return <button onClick={()=>console.log(this.props)}>button</button>
//         return ( this.props.stripe !== null?
//             <div>
//                 <PaymentRequestButtonElement options={this.props.stripe.paymentRequest({
//             country: 'GB',
//             currency: 'eur',
//             total: {
//               label: 'Demo total',
//               amount: 1099,
//             },
//             requestPayerName: true,
//             requestPayerEmail: true,
//           })}/>
//             </div>
//             : <></>
//         );
//     }
// }
// const mapStateToProps = (state) => {
//     return {
//         newOrder: state.newOrder,
//     };
// };
// const mapDispatchToProps = (dispatch) =>
//     bindActionCreators(
//         {
//             newOrderStartPaying,
//             newOrderStopPaying,
//             newOrderSetErrors,
//         },
//         dispatch
//     );

// export default connect(mapStateToProps, mapDispatchToProps)(PaymentButton);
// class PaymentButton extends React.Component {
//     constructor(props) {
//       // For full documentation of the available paymentRequest options, see:
//       // https://stripe.com/docs/stripe.js#the-payment-request-object
//       const paymentRequest = props.stripe.paymentRequest({
//         country: 'US',
//         currency: 'usd',
//         total: {
//           label: 'Demo total',
//           amount: 1000,
//         },
//       });
//       paymentRequest.on('token', ({complete, token, ...data}) => {
//         console.log('Received Stripe token: ', token);
//         console.log('Received customer information: ', data);
//         complete('success');
//       });
//       paymentRequest.canMakePayment().then((result) => {
//         this.setState({canMakePayment: !!result});
//       });
//       this.state = {
//         canMakePayment: false,
//         paymentRequest,
//       };
//     }
//     render() {
//       return this.state.canMakePayment ? (
//         <PaymentRequestButtonElement
//           paymentRequest={this.state.paymentRequest}
//           className="PaymentRequestButton"
//           style={{
//             // For more details on how to style the Payment Request Button, see:
//             // https://stripe.com/docs/elements/payment-request-button#styling-the-element
//             paymentRequestButton: {
//               theme: 'light',
//               height: '64px',
//             },
//           }}
//         />
//       ) : null;
//     }
//   }
//   export default injectStripe(PaymentButton);
import React, {useState, useEffect} from 'react';
import {PaymentRequestButtonElement, useStripe} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{paymentRequest}} />
  }

  // Use a traditional checkout form.
  return 'Insert your form or button component here.';
}
export default CheckoutForm