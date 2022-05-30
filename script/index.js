import { fetchData, displayUsers, clearHTML, firstLetterToUpperCase, usersList, allUsersArr, checkLoggedInStatus, setLocalStorage } from './reusable-functions.js';

const ALL_USERS_API = 'https://randomuser.me/api/?results=150&inc=picture,gender,name,nat,dob,location,login';
const QUIZ_JSON = '../quiz.json';

const searchField = document.querySelector('#search-users');
const radioBtnMale = document.querySelector('#male');
const radioBtnFemale = document.querySelector('#female');
const radioBtnBoth = document.querySelector('#both');

async function getQuizData(arr) {
    await fetch(QUIZ_JSON)
        .then(res => res.json())
        .then(data => console.log(data[0].answers));
}


/* Need ranNum as parameter to decide what quiz answer each user gets */
function pushQuizData(arr) {
    arr.forEach(user => {
        if (!user.hasOwnProperty('quizAnswers')) {
            user.quizAnswers = {
                faouriteAnimal: 'test'
            };
        }
    });

    setLocalStorage('allUsers', arr);
}

/* I could have made this func reusable, but that would have required to many params and nested calbacks to be practical */
function checkIfUsersExist() {
    if (localStorage.getItem('allUsers') === null) {
        fetchData(ALL_USERS_API, allUsersArr, usersList, displayUsers);
    } else {
        displayUsers(allUsersArr);
        pushQuizData(allUsersArr);
    }
}

checkLoggedInStatus(checkIfUsersExist);

function validateSearch(userInput, users) {
    if (!isNaN(parseInt(userInput))) {
        usersList.classList.remove('users-list');
        usersList.innerHTML = `<li>Use only letters!</li>`;
    } else if (users.length < 1) {
        usersList.classList.remove('users-list');
        const formattedSearchString = firstLetterToUpperCase(userInput);
        usersList.innerHTML = `<li>${formattedSearchString} not found, please try a different search query!</li>`;
    }
}

function filterUserNames(arr) {
    const searchString = document.querySelector('#search-users').value.toLowerCase();
    let filteredUsers;

    clearHTML(usersList);

    if (radioBtnMale.checked === true) {
        filteredUsers = arr.filter(user => {
            return (user.gender === 'male' && (user.name.first.toLowerCase().includes(searchString) || user.name.last.toLowerCase().includes(searchString)));
        });
    } else if (radioBtnFemale.checked === true) {
        filteredUsers = arr.filter(user => {
            return (user.gender === 'female' && (user.name.first.toLowerCase().includes(searchString) || user.name.last.toLowerCase().includes(searchString)));
        });
    } else {
        filteredUsers = arr.filter(user => {
            return (user.name.first.toLowerCase().includes(searchString) || user.name.last.toLowerCase().includes(searchString));
        });
    }

    usersList.classList.add('users-list');

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

    clearHTML(usersList);
    displayUsers(filteredGender);
}

radioBtnMale.addEventListener('click', () => {
    filterGender(allUsersArr, radioBtnMale);
});

radioBtnFemale.addEventListener('click', () => {
    filterGender(allUsersArr, radioBtnFemale);
});

radioBtnBoth.addEventListener('click', () => {
    filterGender(allUsersArr, radioBtnBoth);
});