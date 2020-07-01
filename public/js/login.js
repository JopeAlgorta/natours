/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts.js';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in Successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios.get('http://localhost:3000/api/v1/users/logout');

        if (res.data.status === 'success') {
            showAlert('success', 'Logged Out Successfully!');
            window.setTimeout(location.reload(true), 1500);
        }
    } catch (err) {
        showAlert('error', 'Error logging out, please try again');
    }
};
