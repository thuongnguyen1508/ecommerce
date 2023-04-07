import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PaypalCheckoutButtons = (props) => {
    const {product} = props;

    const [paidFor, setPaidFor] = useState(false);
    const [err, setErr] = useState(null)

    const handleApprove = (oderId) => {
      // Call backend to fullfil order

      //if success

      setPaidFor(true);
      //Refresh user account or subscription status
    }

    if(paidFor) {
      alert("Thank you")
    }

    if(err) {
      alert(err);
    }

    return (
        <PayPalButtons 
        style={{ 
          layout: 'vertical',
          color:  'gold',
          shape:  'pill',
          label:  'paypal'
        }}

        createOrder = {(data, actions) => {
          // Set up the transaction
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: product.price
              }
            }]
          });
        }
      }

      onClick = {async(data, actions) => {
          const hasBought = false;
          if(hasBought) {
            setErr("You have already bought this !")
          }
        }
      }

      onApprove = {async(data, actions) => {
        const order = await actions.order.capture();
        console.log("order",order);
        handleApprove(data.orderID);
        }
      }

      onCancel = {() => {
      }}

      onError = {(err) => {
        setErr(err);
        console.log("Failed")
      }
    }
    
        />


    );
}

export default PaypalCheckoutButtons;