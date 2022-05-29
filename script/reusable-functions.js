export const usersList = document.querySelector('.users-list');
export const allUsersArr = JSON.parse(localStorage.getItem('allUsers')) || [];
export const port = window.location.port;

export async function fetchData(apiData, arr, el, callback) {
    try {
        const response = await fetch(apiData);
        const data = await response.json();

        if (arr.length === 0) {
            arr.push(...data.results);
        }

        callback(arr);
    }
    catch (err) {
        displayErr(el, err);
    }
}

function usersTemplate(user) {
    usersList.innerHTML += `
            <li class='user-li'>
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



export function likeProfile(i, el) {
    if (allUsersArr[findIndexByName(i)].like === false || allUsersArr[findIndexByName(i)].like === undefined) {
        allUsersArr[findIndexByName(i)].like = true;
        el.src = '../assets/heart-filled.png';
    } else if (allUsersArr[findIndexByName(i)].like === true) {
        allUsersArr[findIndexByName(i)].like = false;
        el.src = '../assets/heart-unfilled.png';
    }
}

function findIndexByName(i) {
    const name = document.querySelectorAll('.name');

    const firstAndLast = name[i].textContent.slice(6);
    const [firstName, lastName] = firstAndLast.split(' ');

    const objMatch = allUsersArr.find(el => el.name.first === firstName && el.name.last === lastName);
    return allUsersArr.indexOf(objMatch);
}

export function likeProfileHandler() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, i) => {
        heart.addEventListener('click', () => {
            likeProfile(i, heart);
            setLocalStorage('allUsers', allUsersArr);
        });
    });
}

function displayErr(el, err) {
    el.innerHTML = `Something went wrong: ${err}`;
}

/* This is a hack to simulate dynamic pages, it is IMPORTANT that you view the site from localhost (not your ip adress),
   or it will not work.
   Ideally i would have used a server, framework or template engine to generate dynamic pages for the users.
   This is a hack to go around these limitations */
export function seeProfile(arr, el) {
    for (let i = 0; i < arr.length; i++) {
        el[i].addEventListener('click', () => {
            setLocalStorage('otherUser', findIndexByName(i));
            document.location.href = `http://localhost:${port}/other-user.html`;
        });
    }
}

export function displayUsers(arr) {
    if (localStorage.getItem('allUsers') === null) {
        setLocalStorage('allUsers', arr);
    }

    arr.forEach((user) => {
        usersTemplate(user);
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

export function setLocalStorage(lsKey, lsValue) {
    localStorage.setItem(lsKey, JSON.stringify(lsValue));
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