// Minimal Razorpay backend server (CommonJS version)
// DO NOT COMMIT THIS FILE TO GITHUB WITH YOUR SECRET KEY!

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();

// Configure CORS to allow requests from Vercel domains
app.use(cors({
  origin: [
    'https://choice-vision-kcet.vercel.app',
    'https://choice-vision-kcet-git-main-cons-pirant.vercel.app',
    'https://choice-vision-kcet-cons-pirant.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Test Razorpay credentials endpoint
app.get('/test-razorpay', async (req, res) => {
  try {
    console.log('Testing Razorpay credentials...');
    console.log('Key ID:', razorpay.key_id);
    console.log('Key Secret exists:', !!razorpay.key_secret);
    
    // Try to create a test order
    const testOrder = await razorpay.orders.create({
      amount: 100, // 1 rupee test
      currency: 'INR',
      receipt: 'test_' + Date.now(),
    });
    
    res.json({ 
      status: 'SUCCESS', 
      message: 'Razorpay credentials are working',
      orderId: testOrder.id,
      keyId: razorpay.key_id,
      hasSecret: !!razorpay.key_secret
    });
  } catch (err) {
    console.error('Razorpay test failed:', err);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Razorpay credentials are not working',
      error: err.message,
      keyId: razorpay.key_id,
      hasSecret: !!razorpay.key_secret
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Razorpay backend running on port ${PORT}`)); 
