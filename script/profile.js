import { fetchData, clearHTML, firstLetterToUpperCase, setLocalStorage, checkLoggedInStatus } from './reusable-functions.js';

const USER_API = 'https://randomuser.me/api/?inc=picture,gender,name,nat,dob,location';
const userArr = [];
let userObj;

const profileInfoUl = document.querySelector('.profile-info-ul');

function singleUserTemplate() {
    profileInfoUl.innerHTML += `
        <li class='user-li'>
            <img class='user-img' src=${userObj.picture.large} />
            <p class='user-name'>Name: ${userObj.name.first} ${userObj.name.last}</p>
            <p>Gender: ${firstLetterToUpperCase(userObj.gender)}</p>
            <p>Title: ${userObj.name.title}</p>
            <p>Age: ${userObj.dob.age}</p>
            <p>City: ${userObj.location.city}</p>
            <p class='user-country'>Country: ${userObj.location.country}</p>
            <p class='user-about'>${userObj.about === '' ? '' : 'About: ' + userObj.about}</p>
        </li>
    `;
}

function displaySIngleUser() {
    if (localStorage.getItem('userData') === null) {
        userObj = { ...userArr[0], about: '' };
        setLocalStorage('userData', userObj);
    } else {
        userObj = JSON.parse(localStorage.getItem('userData'));
    }

    singleUserTemplate();
}

function checkIfSingleUserExist() {
    if (localStorage.getItem('userData') === null) {
        fetchData(USER_API, userArr, profileInfoUl, displaySIngleUser);
    } else {
        displaySIngleUser();
    }
}

checkLoggedInStatus(checkIfSingleUserExist);

function updateUser() {
    const saveBtn = document.querySelector('.save-btn');
    const userAbout = document.querySelector('#about');
    const userAge = document.querySelector('#age');
    const userGender = document.querySelector('#gender');
    const userCity = document.querySelector('#city');
    const userCountry = document.querySelector('#country');
    const userTitle = document.querySelector('#title');
    const userFirstName = document.querySelector('#first-name');
    const userLastName = document.querySelector('#last-name');

    saveBtn.addEventListener('click', () => {
        userObj = {
            ...userObj,
            dob: {
                age: userAge.value.trim() === '' ? userObj.dob.age : userAge.value.trim()
            },
            gender: userGender.value.trim() === '' ? userObj.gender : userGender.value.trim(),
            location: {
                city: userCity.value.trim() === '' ? userObj.location.city : firstLetterToUpperCase(userCity.value.trim()),
                country: userCountry.value.trim() === '' ? userObj.location.country : firstLetterToUpperCase(userCountry.value.trim())
            },
            name: {
                title: userTitle.value.trim() === '' ? userObj.name.title : firstLetterToUpperCase(userTitle.value.trim()),
                first: userFirstName.value.trim() === '' ? userObj.name.first : firstLetterToUpperCase(userFirstName.value.trim()),
                last: userLastName.value.trim() === '' ? userObj.name.last : firstLetterToUpperCase(userLastName.value.trim()),
            },
            about: userAbout.value.trim() === '' ? userObj.about : userAbout.value.trim()
        };

        clearHTML(profileInfoUl);
        setLocalStorage('userData', userObj);
        singleUserTemplate();
    });
}

updateUser();



