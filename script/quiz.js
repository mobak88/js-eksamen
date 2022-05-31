import { setLocalStorage, allUsersArr } from './reusable-functions.js';

const quizFormBtn = document.querySelector('.quiz-form-btn');

function findMatchingUsers(myProfile) {
    const matchingUsers = allUsersArr.filter(user => {
        return (user.quizAnswers.faouriteAnimal.animal === myProfile.quizAnswers.faouriteAnimal.animal) && (user.quizAnswers.faouriteHobby.hobby === myProfile.quizAnswers.faouriteHobby.hobby);
    });

    console.log(matchingUsers);
}

quizFormBtn.addEventListener('click', (e) => {
    const favAnimal = document.querySelector('[name="fav_animal"]:checked');
    const favMovie = document.querySelector('[name="fav_movie"]:checked');
    const favHobby = document.querySelector('[name="fav_hobby"]:checked');
    e.preventDefault();

    if ((favAnimal || favMovie || favHobby) === null) {
        console.log('err');
        return;
    } else {
        const user = JSON.parse(localStorage.getItem('userData'));

        user.quizAnswers = {
            faouriteAnimal: { animal: favAnimal.value },
            faouriteHobby: { hobby: favMovie.value },
            faouriteMovie: { movie: favHobby.value }
        };

        setLocalStorage('userData', user);
    }
});

const user = JSON.parse(localStorage.getItem('userData'));
console.log(allUsersArr);
findMatchingUsers(user);



