import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PaypalCheckoutButtons = ({ amount, currency, onApprove, onError, onCancel }) => {
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount,
            currency_code: currency,
          },
        },
      ],
    });
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": "AbtvtM_xu6Ks210f3HMj1I-jxKxMkvQSv7Q05eE5F37WGlQGbvQRKOduMPP0RLacEMzncMujWyTDJ3pR",
        currency: currency,
      }}
    >
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
      />
    </PayPalScriptProvider>
  );
};


export default PaypalCheckoutButtons;