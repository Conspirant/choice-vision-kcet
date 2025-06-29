// Minimal Razorpay backend server (CommonJS version)
// DO NOT COMMIT THIS FILE TO GITHUB WITH YOUR SECRET KEY!

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables for security
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_7O5QP1s4dVusRGhHi7lyWpKhh',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'O5QP1s4dVusRGhHi7lyWpKhh' // <-- FILL THIS IN
});

app.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount, // in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    });
    res.json(order);
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Razorpay backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Razorpay backend running on port ${PORT}`)); 