export const usersList = document.querySelector('.users-list');
export const allUsersArr = JSON.parse(localStorage.getItem('allUsers')) || [];
export const port = window.location.port;

function displayErr(el, err) {
    el.innerHTML = `Something went wrong: ${err}`;
}

export async function fetchData(apiData, arr, el, callback) {
    try {
        const response = await fetch(apiData);
        const data = await response.json();

        arr.push(...data.results);

        callback(arr);
    }
    catch (err) {
        displayErr(el, err);
        console.log(err);
    }
}

function usersTemplate(user, el) {
    el.innerHTML += `
        <li class='user-li' id=${user.login.uuid}>
            <img class='user-img' src=${user.picture.large} />
            <p class='name'>Name: ${user.name.first} ${user.name.last}</p>
            <p>Gender: ${user.gender}</p>
            <p>Age: ${user.dob.age}</p>
            <p>City: ${user.location.city}</p>
            <p>Country: ${user.location.country}</p>
            <button class='see-profile'>See Profile</button>
            <img class='heart' src=${user.like === true ? '../assets/heart-filled.png' : '../assets/heart-unfilled.png'} />
        </li>
    `;
}

function findIndexByUuid(uuid) {
    const objMatch = allUsersArr.find(el => el.login.uuid === uuid);
    return allUsersArr.indexOf(objMatch);
}

/* Alternative func to find the correct index by name. The above func (findIndexByUuid) is more robust */
// function findIndexByName(i) {
//     const name = document.querySelectorAll('.name');

//     const firstAndLast = name[i].textContent.slice(6);
//     const [firstName, lastName] = firstAndLast.split(' ');

//     const objMatch = allUsersArr.find(el => el.name.first === firstName && el.name.last === lastName);
//     return allUsersArr.indexOf(objMatch);
// }

export function likeProfile(uuid, el) {
    if (allUsersArr[findIndexByUuid(uuid)].like === false || allUsersArr[findIndexByUuid(uuid)].like === undefined) {
        allUsersArr[findIndexByUuid(uuid)].like = true;
        el.src = '../assets/heart-filled.png';
    } else if (allUsersArr[findIndexByUuid(uuid)].like === true) {
        allUsersArr[findIndexByUuid(uuid)].like = false;
        el.src = '../assets/heart-unfilled.png';
    }
}

export function setLocalStorage(lsKey, lsValue) {
    localStorage.setItem(lsKey, JSON.stringify(lsValue));
}

export function likeProfileHandler() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart) => {
        heart.addEventListener('click', (e) => {
            likeProfile(e.target.parentNode.id, heart);
            setLocalStorage('allUsers', allUsersArr);
        });
    });
}

/* This is a hack to simulate dynamic pages, it is IMPORTANT that you view the site from localhost (not your ip adress),
   or it will not work.
   Ideally i would have used a server, framework or template engine to generate dynamic pages for the users.
   This is a hack to go around these limitations */
export function seeProfile(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        el[i].addEventListener('click', (e) => {
            setLocalStorage('otherUser', findIndexByUuid(e.target.parentNode.id));
            document.location.href = `http://localhost:${port}/other-user.html`;
        });
    }
}

export function displayUsers(arr) {
    if (localStorage.getItem('allUsers') === null) {
        setLocalStorage('allUsers', arr);
    }

    arr.forEach((user) => {
        usersTemplate(user, usersList);
    });

    const seeprofileBtns = document.querySelectorAll('.see-profile');
    seeProfile(arr, seeprofileBtns);
    likeProfileHandler(arr);
}

export function clearHTML(element) {
    element.innerHTML = '';
}

export function firstLetterToUpperCase(userInput) {
    return userInput.charAt(0).toUpperCase() + userInput.slice(1);
}

export function checkLoggedInStatus(callback) {
    const main = document.querySelector('main');
    if (!JSON.parse(localStorage.getItem('loggedIn')) || localStorage.getItem('loggedIn') === null) {
        main.classList.add('hidden');
        document.location.href = `http://localhost:${port}/login.html`;
    } else {
        main.classList.remove('hidden');
        callback();
    }
}