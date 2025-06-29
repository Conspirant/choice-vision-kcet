# Deployment Guide for KCET Choice Vision

This guide will help you deploy both the frontend and backend to make payments work in production.

## 🚀 Quick Deploy to Render.com (Recommended)

### Step 1: Deploy Backend to Render

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name:** `kcet-backend` (or any name you prefer)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. **Add Environment Variables:**
   - Click "Environment" tab
   - Add these variables:
     - `RAZORPAY_KEY_ID`: Your Razorpay Live Key ID
     - `RAZORPAY_KEY_SECRET`: Your Razorpay Live Key Secret

6. **Deploy:** Click "Create Web Service"

7. **Get your backend URL:** Once deployed, you'll get a URL like `https://your-app-name.onrender.com`

### Step 2: Update Frontend with Backend URL

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add:** `VITE_BACKEND_URL` = `https://your-app-name.onrender.com` (use your actual backend URL)
5. **Redeploy** your frontend

### Step 3: Test Payment Flow

1. Visit your deployed frontend
2. Try to access PDF or Analytics
3. Payment should now work with real Razorpay integration

## 🔧 Alternative: Deploy to Railway

### Backend Deployment on Railway:

1. **Go to [Railway.app](https://railway.app)**
2. **Create new project**
3. **Deploy from GitHub**
4. **Add environment variables:**
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. **Get your backend URL and update frontend**

## 🛠️ Local Development

### Running Backend Locally:

```bash
# Install dependencies
npm install

# Start backend
npm start

# Backend will run on http://localhost:5000
```

### Running Frontend Locally:

```bash
# Install dependencies (if not already done)
npm install

# Start frontend
npm run dev

# Frontend will run on http://localhost:5173
```

## 🔑 Environment Variables

### Backend (razorpay-server.cjs):
- `RAZORPAY_KEY_ID`: Your Razorpay Live Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay Live Key Secret
- `PORT`: Port number (default: 5000)

### Frontend:
- `VITE_BACKEND_URL`: URL of your deployed backend

## 📝 Important Notes

1. **Never commit your Razorpay secret key to GitHub**
2. **Use environment variables for all sensitive data**
3. **Test payments in development mode first**
4. **Make sure your backend is accessible from your frontend domain**

## 🚨 Troubleshooting

### "Payment failed: Failed to create order"
- Check if backend is running and accessible
- Verify Razorpay credentials are correct
- Check backend logs for errors

### CORS Issues
- Backend already has CORS configured
- If issues persist, check your hosting provider's CORS settings

### Environment Variables Not Working
- Make sure to redeploy after adding environment variables
- Check variable names are exactly correct
- Verify no extra spaces in values

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Check your backend logs
3. Verify all environment variables are set correctly
4. Test with a small amount first

---

**Your payment system will work perfectly once both frontend and backend are deployed with the correct environment variables!** 