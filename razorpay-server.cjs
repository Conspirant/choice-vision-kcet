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
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_byPF6D1GXctRmu',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'hXqkoju6twmTCAv8foQtuPcX' // <-- FILL THIS IN
});

app.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  
  // Log the request and credentials (without exposing secret)
  console.log('Create order request:', { amount });
  console.log('Razorpay Key ID:', razorpay.key_id);
  console.log('Razorpay Key Secret exists:', !!razorpay.key_secret);
  
  try {
    const order = await razorpay.orders.create({
      amount: amount, // in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    });
    console.log('Order created successfully:', order.id);
    res.json(order);
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    console.error('Error details:', {
      message: err.message,
      statusCode: err.statusCode,
      error: err.error
    });
    res.status(500).json({ 
      error: 'Failed to create order',
      details: err.message,
      statusCode: err.statusCode || 'unknown'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Razorpay backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Razorpay backend running on port ${PORT}`)); 
