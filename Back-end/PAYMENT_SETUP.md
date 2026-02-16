# Payment Integration Setup Guide

This document provides instructions for setting up the Stripe payment integration for the Online Bookstore.

## Backend Setup

### 1. Stripe Configuration

1. Create a Stripe account at [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your API keys from the Stripe Dashboard > Developers > API keys
3. Update the `application.properties` file with your Stripe keys:

```properties
# Stripe Configuration
stripe.secret.key=sk_test_YOUR_SECRET_KEY_HERE
stripe.public.key=pk_test_YOUR_PUBLIC_KEY_HERE
```

**Note:** Use test keys for development. For production, use live keys.

### 2. Dependencies

The following dependencies have been added to `pom.xml`:

- `stripe-java` - Stripe Java SDK
- `jakarta.annotation-api` - For @PostConstruct annotation

### 3. Payment Models

- `Payment.java` - Payment entity model
- `PaymentRequest.java` - DTO for payment requests
- `PaymentResponse.java` - DTO for payment responses

### 4. API Endpoints

The following endpoints are available:

- `POST /api/payments/create-payment-intent` - Create a payment intent
- `POST /api/payments/confirm-payment` - Confirm a payment
- `GET /api/payments/order/{orderId}` - Get payment by order ID
- `POST /api/payments/refund/{paymentId}` - Refund a payment

## Frontend Setup

### 1. Stripe Dependencies

The following dependencies have been added to `package.json`:

- `@stripe/react-stripe-js` - React Stripe components
- `@stripe/stripe-js` - Stripe.js library

### 2. Components

- `Checkout.js` - Main checkout component with Stripe integration
- `Checkout.css` - Styling for checkout page

### 3. Configuration

Update the Stripe publishable key in `Checkout.js`:

```javascript
const stripePromise = loadStripe("pk_test_YOUR_PUBLIC_KEY_HERE");
```

## Payment Flow

1. **Cart → Checkout**: User proceeds from cart to checkout page
2. **Payment Intent**: Backend creates Stripe PaymentIntent
3. **Card Collection**: Frontend collects card details using Stripe Elements
4. **Payment Confirmation**: Stripe processes payment
5. **Order Creation**: Successful payment creates order in database
6. **Redirect**: User redirected to orders page

## Testing

### Test Cards

Use these Stripe test cards for testing:

| Card Number      | Expiry          | CVC          | Description        |
| ---------------- | --------------- | ------------ | ------------------ |
| 4242424242424242 | Any future date | Any 3 digits | Successful payment |
| 4000000000000002 | Any future date | Any 3 digits | Card declined      |
| 4000000000009995 | Any future date | Any 3 digits | Insufficient funds |

### Testing Flow

1. Add books to cart
2. Proceed to checkout
3. Fill in shipping information
4. Use test card details
5. Complete payment
6. Verify order creation

## Security Notes

- Never expose your secret Stripe key in frontend code
- Always use HTTPS in production
- Validate payment confirmations on the backend
- Implement proper error handling for failed payments

## Production Deployment

1. Replace test keys with live Stripe keys
2. Enable webhook endpoints for payment status updates
3. Implement proper logging and monitoring
4. Set up fraud detection measures
5. Configure proper CORS settings

## Troubleshooting

### Common Issues

1. **Stripe API Error**: Check if API keys are correct
2. **Payment Intent Creation Failed**: Verify backend connectivity to Stripe
3. **Frontend Errors**: Ensure Stripe.js is properly loaded
4. **CORS Issues**: Check backend CORS configuration

### Debug Mode

Enable Stripe debug mode by adding to `application.properties`:

```properties
logging.level.com.stripe=DEBUG
```

## Support

For Stripe-specific issues:

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For application issues:

- Check application logs
- Verify database connectivity
- Test API endpoints directly
