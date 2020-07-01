/* eslint-disable */
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { signup } from './signup.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';

// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.l-form');
const signupForm = document.querySelector('.s-form');
const logoutButton = document.querySelector('.nav__el--logout');
const updateDataForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

// Delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        signup(name, email, password, confirmPassword);
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

if (updateDataForm) {
    updateDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });
}

if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const currentPassword = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm').value;
        document.querySelector('.btn--save-password').textContent = 'Updating...';
        await updateSettings({ currentPassword, password, confirmPassword }, 'password');
        document.querySelector('.btn--save-password').textContent = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}
