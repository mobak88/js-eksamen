import { fetchData, clearHTML } from './reusable-functions.js';

const USER_API = 'https://randomuser.me/api/';
const userArr = [];
let userObj;

const profileInfoContainer = document.querySelector('.profile-info-container');

function name() {
    const saveBtn = document.querySelector('.save-btn');
    const userCountryInput = document.querySelector('#country');

    saveBtn.addEventListener('click', () => {
        userObj.location.country = userCountryInput.value;
        clearHTML(profileInfoContainer);
        singleUserTemplate();
        console.log(userObj);
    });
}

function singleUserTemplate() {
    userObj = { ...userArr[0] };
    profileInfoContainer.innerHTML += `
        <li class='user-li'>
            <img class='user-img' src=${userObj.picture.large} />
            <p class='user-name'>Name: ${userObj.name.first} ${userObj.name.last}</p>
            <p>Gender: ${userObj.gender}</p>
            <p>Title: ${userObj.name.title}</p>
            <p>Age: ${userObj.dob.age}</p>
            <p>City: ${userObj.location.city}</p>
            <p class='user-country'>Country: ${userObj.location.country}</p>
            <p class='user-about'>${userObj.about ? userObj.about : ''}</p>
        </li>
    `;

}

fetchData(USER_API, userArr, singleUserTemplate);

name();

