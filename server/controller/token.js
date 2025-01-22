const axios = require("axios");
require("dotenv").config(); // For environment variables

let token = null; // Global token variable

// Function to create and store OAuth token
const createToken = async (req, res, next) => {
  try {
    const secret = process.env.MPESA_SECRET;
    const consumer = process.env.MPESA_CONSUMER;
    const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );

    token = response.data.access_token; // Store the token globally
    console.log("Generated Token:", token);
    next(); // Proceed to the next middleware or route
  } catch (err) {
    console.error("Error generating token:", err);
    res.status(500).json({ error: "Failed to generate OAuth token" });
  }
};

// Function to initiate an STK Push request
const stkPush = async (req, res) => {
  try {
    const shortCode = 174379;
    const phone = req.body.phone.substring(1); // Remove leading 0 from phone number
    const amount = req.body.amount;
    const passkey = process.env.MPESA_PASSKEY;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      "base64"
    );

    const data = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: `254${phone}`,
      PartyB: shortCode,
      PhoneNumber: `254${phone}`,
      CallBackURL: "https://yourdomain.com/callback",
      AccountReference: "VenusEmpire",
      TransactionDesc: "Testing stk push",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      data,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("STK Push Response:", response.data);
    res.status(200).json(response.data); // Send response to client
  } catch (err) {
    console.error("Error in STK Push:", err);
    res.status(500).json({ error: "STK Push request failed", details: err.message });
  }
};

module.exports = { createToken, stkPush };
