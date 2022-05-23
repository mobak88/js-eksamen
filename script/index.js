import { fetchData, displayUsers, clearHTML, firstLetterToUpperCase, userList } from './functions.js';

const ALL_USERS_API = 'https://randomuser.me/api/?results=120';
const allUsersArr = [];

const searchField = document.querySelector('#search-users');

fetchData(ALL_USERS_API, allUsersArr, displayUsers);

function validateSearch(userInput, users) {
    if (!isNaN(parseInt(userInput))) {
        userList.classList.remove('users-list');
        userList.innerHTML = `<li>Use only letters!</li>`;
    } else if (users.length < 1) {
        userList.classList.remove('users-list');
        const formattedSearchString = firstLetterToUpperCase(userInput);
        userList.innerHTML = `<li>${formattedSearchString} not found, please try a different search query!</li>`;
    }
}

function filterUserNames(arr) {
    const searchString = document.querySelector('#search-users').value.toLowerCase();

    clearHTML(userList);

    const filteredUsers = arr.filter(user => {
        return (user.name.first.toLowerCase().includes(searchString) || user.name.last.toLowerCase().includes(searchString));
    });

    userList.classList.add('users-list');

    displayUsers(filteredUsers);
    validateSearch(searchString, filteredUsers);
}

searchField.addEventListener('keyup', () => {
    filterUserNames(allUsersArr);
});

function filterGender(arr, radioBtn) {
    let filteredGender = arr.filter(user => {
        return user.gender === radioBtn.value.toLowerCase();
    });

    if (radioBtn.value === 'Both') {
        filteredGender = arr.filter(user => {
            return user;
        });
    }

    clearHTML(userList);
    displayUsers(filteredGender);
}

const radioBtnMale = document.querySelector('#male');
radioBtnMale.addEventListener('click', () => {
    filterGender(allUsersArr, radioBtnMale);
});

const radioBtnFemale = document.querySelector('#female');
radioBtnFemale.addEventListener('click', () => {
    filterGender(allUsersArr, radioBtnFemale);
});

const radioBtnBoth = document.querySelector('#both');
radioBtnBoth.addEventListener('click', () => {
    filterGender(allUsersArr, radioBtnBoth);
});