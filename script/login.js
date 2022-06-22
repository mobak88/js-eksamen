import { setLocalStorage, siteUrl } from './reusable-functions.js';

const userName = 'test';
const password = 'test123';


function validateForm() {
    const loginBtn = document.querySelector('.login-btn');
    const feedback = document.querySelector('.form-feedback');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const typedUsername = document.querySelector('#username').value.trim();
        const typedPassword = document.querySelector('#password').value.trim();

        if (typedUsername === userName && typedPassword === password) {
            setLocalStorage('loggedIn', true);
            feedback.textContent = 'Success';
            /* Used settimeout here to give the user a chance to see the success msg */
            setTimeout(() => {
                document.location.href = siteUrl;
            }, 200);
        } else if (typedUsername === userName && typedPassword !== password) {
            feedback.textContent = 'Wrong password';
            return;
        } else if (typedPassword === password && typedUsername !== userName) {
            feedback.textContent = 'Wrong username';
            return;
        } else if (typedPassword === '' || typedUsername === '') {
            feedback.textContent = 'Please fill in username and password';
        }
    });
}

function displayForm() {
    const loginContainer = document.querySelector('.login-container');
    const loggedInText = document.querySelector('.logged-in-paragraph');
    if (JSON.parse(localStorage.getItem('loggedIn'))) {
        loginContainer.classList.add('hidden');
        loggedInText.classList.remove('hidden');
    } else {
        loggedInText.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    }

    validateForm();
}

displayForm();