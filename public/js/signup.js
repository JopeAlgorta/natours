/* eslint-disable */

import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts.js';

export const signup = async (name, email, password, confirmPassword) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                confirmPassword
            }
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                'Registration Successful! Check your email to activate your account!'
            );
            window.setTimeout(() => {
                location.assign('/login');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
