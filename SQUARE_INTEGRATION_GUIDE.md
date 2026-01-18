# 💳 Square Payments Integration Guide

## Overview

Your MK Nails website now has a **unified, professional booking system** with integrated Square payments. Customers can:

1. 📅 Select a service from the homepage
2. 📅 Choose date & time
3. 📅 Enter contact info
4. 📅 Confirm their booking (saved to your database)
5. 💳 Pay securely via Square (COMING NEXT)

---

## Current Setup (Phase 1: Booking System)

The booking system is **COMPLETE AND WORKING**. Customers can:
- Book appointments via the modal on the homepage
- Receive SMS confirmations
- Get saved to your database

### Test It:
```bash
cd ~/Desktop/mk-nails-website/frontend
npm run dev
```

Then:
1. Click "Book Now" button
2. Select a service
3. Enter name & phone
4. Pick date & time
5. Click "Confirm Booking"
6. Should see ✅ confirmation

---

## Phase 2: Square Payment Integration (SETUP REQUIRED)

### Step 1: Create/Login to Square Account

1. Go to [squareup.com](https://squareup.com)
2. Sign up or log in
3. Navigate to **Developer** > **Applications**
4. Create a new application (or use existing)

### Step 2: Get Your Credentials

In Square Dashboard:
1. Go to **Developer** > **API Keys**
2. Copy these values:
   - `Application ID` (starts with `sq0...`)
   - `Access Token` (long string, starts with `sq0a...`)
   - `Location ID` (found under **Settings** > **Business Locations**)

### Step 3: Set Environment Variables

Create a `.env.local` file in your **frontend** folder:

```env
VITE_SQUARE_APPLICATION_ID=sq0ABC123...  # Your Application ID
VITE_SQUARE_LOCATION_ID=L1ABC123...      # Your Location ID
VITE_API_BASE_URL=http://localhost:5000  # Your backend
```

### Step 4: Update Backend for Payment Processing

Create a payment endpoint in your backend (`backend/routes/payments.js`):

```javascript
const { Client, Environment } = require('square');

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production, // Use Sandbox for testing
});

const { paymentsApi } = client;

router.post('/api/payments/process', async (req, res) => {
  try {
    const { sourceId, amount, bookingId } = req.body;

    const response = await paymentsApi.createPayment({
      sourceId: sourceId,
      amountMoney: {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'USD',
      },
      idempotencyKey: `${bookingId}-${Date.now()}`,
    });

    if (response.result) {
      // Update booking with payment status
      await updateBookingPaymentStatus(bookingId, 'completed', response.result.id);
      res.json({ success: true, transactionId: response.result.id });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

### Step 5: Update Frontend Payment Component

The homepage will be updated with a payment form after booking confirmation.

---

## Environment Variables Needed

### Frontend (`.env.local`)
```env
VITE_SQUARE_APPLICATION_ID=your_app_id
VITE_SQUARE_LOCATION_ID=your_location_id
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`.env`)
```env
SQUARE_ACCESS_TOKEN=your_access_token
SQUARE_ENVIRONMENT=sandbox  # Use 'production' when live
DATABASE_URL=your_database_url
```

---

## Testing Payment Flow

### Use Square Test Cards:

**Success:**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

**Declined:**
- Card: `5555 5555 5555 4444`
- Expiry: Any future date
- CVV: Any 3 digits

### Test Flow:
1. Make a booking
2. Click "Pay Now"
3. Enter test card details
4. Should see ✅ payment success

---

## Production Checklist

- [ ] Square account created
- [ ] API credentials saved securely (NEVER commit `.env` files)
- [ ] Backend payment endpoint implemented
- [ ] Frontend payment form integrated
- [ ] Test with sandbox credentials
- [ ] Switch to production environment
- [ ] SSL certificate enabled (for Vercel, automatic)
- [ ] Payment reminders/confirmations configured

---

## What Happens After Payment?

1. ✅ Payment processed via Square
2. 💳 Funds appear in Square Dashboard
3. 📱 Customer gets SMS confirmation
4. 🗓 Appointment saved to your system
5. 📧 You get email notification

---

## Troubleshooting

### "Payment failed" error
- Check credentials in `.env.local`
- Verify test card is correct
- Check browser console for exact error

### "Location ID not found"
- Go to Square Dashboard > Settings > Business Locations
- Copy the ID next to your location

### Payment processes but not saved
- Check backend logs
- Verify database connection
- Check `/api/payments/process` endpoint responds

---

## Support

- Square Documentation: https://developer.squareup.com
- Square API Reference: https://developer.squareup.com/reference/square
- React SDK: https://www.npmjs.com/package/react-square-web-payments-sdk

---

## Security Notes

⚠️ **IMPORTANT:**
- NEVER commit `.env` files with real credentials
- Use environment variables for all secrets
- On Vercel, add secrets in **Settings** > **Environment Variables**
- Square handles PCI compliance for you
- Always use HTTPS in production

---

**Status:** 📕 Booking system LIVE | 🔘 Payments (ready to integrate)
