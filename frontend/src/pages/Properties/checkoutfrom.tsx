import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { TextField, Button, CircularProgress, Typography, Box } from '@mui/material';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// กำหนดประเภทของ props
interface CheckoutFormProps {
    bookingId: string; // หรือ number ถ้าคุณใช้ bookingId เป็นหมายเลข
}

const stripePromise = loadStripe('YOUR_PUBLISHABLE_KEY'); // เปลี่ยนเป็น publishable key ของคุณ

const CheckoutForm: React.FC<CheckoutFormProps> = ({ bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [error, setError] = useState<string | null>(null); // ระบุประเภทเป็น string หรือ null
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
        setError("Stripe.js has not loaded properly. Please try again later.");
        setLoading(false);
        return;
    }

    const cardElement = elements.getElement(CardElement);

    const response = await fetch('http://localhost:8080/api/v1/payments/create-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId }),
    });

    const { clientSecret } = await response.json();

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement!,
        },
    });

    if (stripeError && typeof stripeError.message === 'string') {
        setError(stripeError.message);
    } else {
        // จัดการการชำระเงินสำเร็จ
        console.log('Payment successful!');
    }
    setLoading(false);
};


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', p: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h5" gutterBottom>
                ชำระเงิน
            </Typography>
            <Box sx={{ mb: 2 }}>
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#000',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#fa755a',
                        },
                    },
                }} />
            </Box>
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Pay'}
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </Box>
    );
};

export default CheckoutForm;
