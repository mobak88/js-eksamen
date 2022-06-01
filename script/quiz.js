import { setLocalStorage, allUsersArr, displayUsers, clearHTML, usersList } from './reusable-functions.js';

const quizFormBtn = document.querySelector('.quiz-form-btn');
const myUser = JSON.parse(localStorage.getItem('userData'));

function findMatchingUsers(myProfile) {
    const sameAnimal = allUsersArr.filter(user => user.quizAnswers.faouriteAnimal.animal === myProfile.quizAnswers.faouriteAnimal.animal);

    const sameHobby = allUsersArr.filter(user => user.quizAnswers.faouriteHobby.hobby === myProfile.quizAnswers.faouriteHobby.hobby);

    const sameMovie = allUsersArr.filter(user => user.quizAnswers.faouriteHobby.hobby === myProfile.quizAnswers.faouriteHobby.hobby);

    const matchingUsers = [...sameAnimal, ...sameHobby, ...sameMovie];
    console.log(matchingUsers, matchingUsers.length);
    displayUsers(matchingUsers);
}

function addFavourites() {
    const favAnimal = document.querySelector('[name="fav_animal"]:checked');
    const favMovie = document.querySelector('[name="fav_movie"]:checked');
    const favHobby = document.querySelector('[name="fav_hobby"]:checked');

    if ((favAnimal || favMovie || favHobby) === null) {
        alert('Please mark one radio button per category');
        return;
    } else {
        myUser.quizAnswers = {
            faouriteAnimal: { animal: favAnimal.value },
            faouriteHobby: { hobby: favHobby.value },
            faouriteMovie: { movie: favMovie.value }
        };

        setLocalStorage('userData', myUser);
        clearHTML(usersList);
        findMatchingUsers(myUser);
    }
}

quizFormBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addFavourites();
});

function checkIfUserDataExists() {
    const quizFormContainer = document.querySelector('.quiz-form-container');
    const matchingUsersContainer = document.querySelector('.matchin-users-container');
    const errMsg = document.querySelector('.err-msg');

    if (localStorage.getItem('userData') === null) {

        errMsg.classList.remove('hidden');
        quizFormContainer.classList.add('hidden');
        matchingUsersContainer.classList.add('hidden');
    } else {
        errMsg.classList.add('hidden');
        quizFormContainer.classList.remove('hidden');
        matchingUsersContainer.classList.remove('hidden');
        checkIfUserHasQuizAnswers();
    }
}

function checkIfUserHasQuizAnswers() {
    if (myUser.hasOwnProperty('quizAnswers')) {
        findMatchingUsers(myUser);
    }
}

checkIfUserDataExists();

