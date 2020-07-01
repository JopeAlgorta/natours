/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts.js';

export const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ? '/api/v1/users/updatePassword' : '/api/v1/users/updateMe';

        const res = await axios.patch(url, data);

        if (res.data.status === 'success') {
            if (type === 'data') showAlert('success', 'Data updated successfully!');
            else showAlert('success', 'Password reset successfully!');
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
