import { fetchData, displayUsers, clearHTML, firstLetterToUpperCase, usersList, allUsersArr, checkLoggedInStatus, setLocalStorage } from './reusable-functions.js';

const ALL_USERS_API = 'https://randomuser.me/api/?results=150&inc=picture,gender,name,nat,dob,location,login';
const QUIZ_JSON = '../quiz.json';

const searchField = document.querySelector('#search-users');
const radioBtnMale = document.querySelector('#male');
const radioBtnFemale = document.querySelector('#female');
const radioBtnBoth = document.querySelector('#both');

function generateRandomQuizAnswers(answers) {
    const randNumber = Math.round(Math.random() * (answers.length - 1));
    return randNumber;
}

function createQuizData(arr, quizData) {
    arr.forEach(user => {
        if (!user.hasOwnProperty('quizAnswers')) {
            const randAnimal = generateRandomQuizAnswers(quizData[0].answers);
            const randMovie = generateRandomQuizAnswers(quizData[0].answers);
            const randHobby = generateRandomQuizAnswers(quizData[0].answers);

            user.quizAnswers = {
                faouriteAnimal: quizData[0].answers[randAnimal],
                faouriteMovie: quizData[1].answers[randMovie],
                faouriteHobby: quizData[2].answers[randHobby],
            };
        }
    });

    setLocalStorage('allUsers', arr);
}

async function getQuizData() {
    await fetch(QUIZ_JSON)
        .then(res => res.json())
        .then(data => {
            const quizData = [...data];
            createQuizData(allUsersArr, quizData);
        })
        .catch(err => console.log(err));
}

async function checkIfUsersExist() {
    if (localStorage.getItem('allUsers') === null) {
        await fetchData(ALL_USERS_API, allUsersArr, usersList, displayUsers)
            .then(() => getQuizData());
    } else {
        displayUsers(allUsersArr);
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