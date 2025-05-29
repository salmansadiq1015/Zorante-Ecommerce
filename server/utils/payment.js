import paypal from "paypal-rest-sdk";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// PayPal Configuration
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// PayPal Payment
export const paypalPayment = async (req, res) => {
  const { amount, currency } = req.body;

  const paymentData = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    },
    transactions: [
      {
        amount: { total: amount, currency },
        description: "Payment for your order",
      },
    ],
  };

  paypal.payment.create(paymentData, (err, payment) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message });
    }

    const approvalUrl = payment.links.find(
      (link) => link.rel === "approval_url"
    );
    res.status(200).json({ success: true, approvalUrl: approvalUrl.href });
  });
};

// Stripe (Mastercard) Payment
export const stripePayment = async (req, res) => {
  try {
    const { amount, currency, token } = req.body;

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency,
      source: token,
      description: "Payment for your order",
    });

    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apple Pay Payment
export const applePayPayment = async (req, res) => {
  try {
    const { paymentData, amount, currency } = req.body;

    // Simulate processing of Apple Pay (requires backend tokenization)
    const paymentToken = paymentData.token;
    if (!paymentToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Apple Pay token." });
    }

    // Apple Pay backend logic (using Stripe as an example)
    const charge = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method: paymentToken,
      confirm: true,
    });

    res.status(200).json({ success: true, charge });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
