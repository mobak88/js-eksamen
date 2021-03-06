import { fetchData, clearHTML, firstLetterToUpperCase, setLocalStorage, checkLoggedInStatus, allUsersArr, likeProfileHandler, seeProfile } from './reusable-functions.js';

const USER_API = 'https://randomuser.me/api/?inc=picture,gender,name,nat,dob,location';
const userArr = [];
let userObj;

const profileInfoUl = document.querySelector('.profile-info-ul');
const newInfoContainer = document.querySelector('.new-info-container');

/* Doing this to prevent XSS attacks */
function sanitizeUserInput() {
    const username = document.querySelector('.user-name');
    const userGender = document.querySelector('.user-gender');
    const userTitle = document.querySelector('.user-title');
    const userAge = document.querySelector('.user-age');
    const userCity = document.querySelector('.user-city');
    const userCountry = document.querySelector('.user-country');
    const userAbout = document.querySelector('.user-about');

    username.textContent = 'Name: ' + `${userObj.name.first} ${userObj.name.last}`;
    userGender.textContent = 'Gender: ' + `${firstLetterToUpperCase(userObj.gender)}`;
    userTitle.textContent = 'Title: ' + `${userObj.name.title}`;
    userAge.textContent = 'Age: ' + `${userObj.dob.age}`;
    userCity.textContent = 'City: ' + `${userObj.location.city}`;
    userCountry.textContent = 'Country: ' + `${userObj.location.country}`;
    userAbout.textContent = `${userObj.about === '' ? '' : 'About: ' + userObj.about}`;
}

function singleUserTemplate(el) {
    el.innerHTML = `
        <li class='user-li'>
            <img class='user-img' src=${userObj.picture.large} />
            <p class='user-name'></p>
            <p class='user-gender'></p>
            <p class='user-title'></p>
            <p class='user-age'></p>
            <p class='user-city'></p>
            <p class='user-country'></p>
            <p class='user-about'></p>
        </li>
    `;

    sanitizeUserInput();
}

function deleteUserInfo() {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const { addedInfo } = userObj;
    deleteBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            addedInfo.splice(i, 1);
            clearHTML(newInfoContainer);
            displayNewUserInfo();
        });
    });
}

function editNewUserInfoTemplate(i) {
    const newElDivs = document.querySelectorAll('.new-el-div');
    newElDivs[i].innerHTML = `
        <label for="edit-new-info-title">Title:</label>
        <input type="text" id="edit-new-info-title" />
        <label for="edit-new-info-text">New Info:</label>
        <textarea
            type="text"
            rows="5"
            id="edit-new-info-text"
            ></textarea>
        <div>
            <button class="save-new-info">Save</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `;
}

function cancelEditingNewUserInfo() {
    const cancelBtn = document.querySelector('.cancel-btn');

    cancelBtn.addEventListener('click', () => {
        clearHTML(newInfoContainer);
        displayNewUserInfo();
    });
}

function saveEditetNewUserInfo(i) {
    const newInfoSaveBtns = document.querySelectorAll('.save-new-info');
    const newInfoTitle = document.querySelector('#edit-new-info-title');
    const newInfoText = document.querySelector('#edit-new-info-text');

    newInfoTitle.value = userObj.addedInfo[i].heading;
    newInfoText.value = userObj.addedInfo[i].info;

    newInfoSaveBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            if (newInfoTitle.value.trim() !== '' && newInfoText.value.trim() !== '') {
                userObj.addedInfo[i] = { heading: newInfoTitle.value.trim(), info: newInfoText.value };
                clearHTML(newInfoContainer);
                displayNewUserInfo();
            } else {
                alert('Edited userInfo can\'t be empty, you need to fill in both title and info');
            }
        });
    });
}

function editNewUserInfo() {
    const newElEditBtns = document.querySelectorAll('.edit-btn');

    newElEditBtns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            clearHTML(newInfoContainer);
            displayNewUserInfo();
            editNewUserInfoTemplate(i);
            saveEditetNewUserInfo(i);
            cancelEditingNewUserInfo();
        });
    });
}

function displayNewUserInfo() {
    const { addedInfo } = userObj;

    addedInfo.forEach(el => {
        const newElText = document.createElement('p');
        const newElTitle = document.createElement('h2');
        const newElDiv = document.createElement('div');
        const newElDeleteBtn = document.createElement('button');
        const newElEditBtn = document.createElement('button');

        newElDiv.classList.add('new-el-div');
        newElDeleteBtn.classList.add('delete-btn');
        newElEditBtn.classList.add('edit-btn');

        newElDeleteBtn.innerText = 'Delete';
        newElEditBtn.innerText = 'Edit';

        newInfoContainer.append(newElDiv);
        newElDiv.append(newElTitle, newElText, newElEditBtn, newElDeleteBtn);
        newElTitle.append(el.heading);
        newElText.append(el.info);
    });

    deleteUserInfo();
    editNewUserInfo();
    setLocalStorage('userData', userObj);
}

function addNewUserInfo() {
    const btn = document.querySelector('.btn');
    const newInfoTitle = document.querySelector('#add-new-info-title');
    const newInfoText = document.querySelector('#add-new-info-text');
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (newInfoText.value.trim() !== '' && newInfoTitle.value.trim() !== '') {
            userObj.addedInfo.push({ heading: firstLetterToUpperCase(newInfoTitle.value.trim()), info: newInfoText.value.trim() });
            newInfoTitle.value = '';
            newInfoText.value = '';
            clearHTML(newInfoContainer);
            displayNewUserInfo();
        } else {
            alert('New userInfo can\'t be empty, you need to fill in both title and info');
        }
    });
}

function likedProfilesTemplate(user, el) {
    el.innerHTML += `
        <li class='liked-profile-li' id=${user.login.uuid}>
            <div class='liked-profile-info-container'>
                <img class='user-img' src=${user.picture.thumbnail} />
                <div>
                    <p class='name'>Name: ${user.name.first} ${user.name.last}</p>
                    <p>Age: ${user.dob.age}</p>
                </div>
            </div>
            <button class='see-profile-btn'>See Profile</button>
            <img class='heart' src=${user.like === true ? '../assets/heart-filled.png' : '../assets/heart-unfilled.png'} />
        </li>
    `;
}

function displayLikedProfiles(arr) {
    const likedProfiles = arr.filter(arr => arr.like === true);
    const likedProfilesUl = document.querySelector('.liked-profiles-ul');

    likedProfiles.forEach((likedUser) => {
        likedProfilesTemplate(likedUser, likedProfilesUl);
    });

    likeProfileHandler();
    const seeProfileBtn = document.querySelectorAll('.see-profile-btn');
    seeProfile(likedProfiles, seeProfileBtn);
}

function displaySIngleUser() {
    if (localStorage.getItem('userData') === null) {
        userObj = { ...userArr[0], about: '', addedInfo: [] };
        setLocalStorage('userData', userObj);
    } else {
        userObj = JSON.parse(localStorage.getItem('userData'));
    }

    singleUserTemplate(profileInfoUl);
    displayNewUserInfo();
    addNewUserInfo();
    displayLikedProfiles(allUsersArr);
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

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
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
        singleUserTemplate(profileInfoUl);
    });
}

updateUser();