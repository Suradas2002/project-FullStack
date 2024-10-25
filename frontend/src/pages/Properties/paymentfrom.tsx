import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Typography, Box, TextField, MenuItem, CircularProgress } from '@mui/material';

interface PaymentFormProps {
    totalAmount: number;
    onPaymentSuccess: (paymentIntent: any) => void;
    bookingId: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ totalAmount, onPaymentSuccess, bookingId }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [country, setCountry] = useState('Thailand');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false); // สถานะโหลด

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);

        if (!cardNumberElement) {
            alert('Card number element is not available');
            return;
        }

        const countryCode = country === "Thailand" ? "TH" : "OTHER";

        // เริ่มโหลด
        setLoading(true);

        const response = await fetch('http://localhost:8080/api/v1/payments/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: totalAmount, 
                bookingId: bookingId 
            }),
        });

        const data = await response.json();
        console.log("Response from backend:", data);

        const { clientSecret, error: intentError } = data;

        if (intentError) {
            alert(`Error creating payment intent: ${intentError}`);
            setLoading(false); // ปิดโหลดเมื่อเกิดข้อผิดพลาด
            return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: nameOnCard,
                    email: email,
                    phone: phone,
                    address: {
                        country: countryCode,
                    },
                },
            },
        });

        setLoading(false); // ปิดโหลดเมื่อได้รับผลลัพธ์

        if (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } else {
            alert('Payment successful!');
            onPaymentSuccess(paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Pay with card
            </Typography>
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
            />
            <Typography variant="subtitle1" gutterBottom>
                Card Information
            </Typography>
            <Box sx={{ mb: 2, border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">Card Number</Typography>
                    <CardNumberElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '18px',
                                    color: '#000',
                                    '::placeholder': { color: '#aab7c4' },
                                },
                                invalid: {
                                    color: '#fa755a',
                                },
                            },
                        }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <Typography variant="body2">Expiration Date</Typography>
                        <CardExpiryElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '18px',
                                        color: '#000',
                                        '::placeholder': { color: '#aab7c4' },
                                    },
                                    invalid: {
                                        color: '#fa755a',
                                    },
                                },
                            }}
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2">CVC</Typography>
                        <CardCvcElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '18px',
                                        color: '#000',
                                        '::placeholder': { color: '#aab7c4' },
                                    },
                                    invalid: {
                                        color: '#fa755a',
                                    },
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <TextField
                fullWidth
                label="Name on card"
                variant="outlined"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                margin="normal"
            />
            <TextField
                select
                fullWidth
                label="Country or region"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                variant="outlined"
                margin="normal"
            >
                <MenuItem value="Thailand">Thailand</MenuItem>
                <MenuItem value="Other Country">Other Country</MenuItem>
                {/* คุณสามารถเพิ่มประเทศอื่น ๆ ได้ตามต้องการ */}
            </TextField>
            <TextField
                fullWidth
                label="Phone number (Optional)"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                margin="normal"
            />
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" type="submit" disabled={!stripe || loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ${totalAmount} THB`}
                </Button>
            </Box>
        </form>
    );
};

export default PaymentForm;
