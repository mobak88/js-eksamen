import { allUsersArr, setLocalStorage } from './reusable-functions.js';

const QUIZ_JSON = '../quiz.json';
let quizData;

async function getQuizData() {
    await fetch(QUIZ_JSON)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            quizData = [...data];
            console.log(quizData);

            pushQuizData(allUsersArr);
        });
}

function generateRandomQuizAnswers(answers) {
    const randNumber = Math.round(Math.random() * (answers.length - 1));
    console.log(randNumber);
    return randNumber;
}

function pushQuizData(arr) {
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

getQuizData();