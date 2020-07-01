/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';
const stripe = Stripe(
    'pk_test_51GxNVjKUgvjZ19y2kiqq5H0y2LlRql40MUFFIABka48Ll1Ss32diLcx5r4izTj2BGjxsp9SVjSsOD3RDGBtIgN8x00S55zQWt1'
);

export const bookTour = async tourId => {
    try {
        const session = await axios(
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
        );

        stripe.redirectToCheckout({
            sessionId: session.data.session.id
        });
    } catch (err) {
        console.error(err);
        showAlert('error', err.message);
    }
};
