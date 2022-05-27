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
                <p>Name: ${user.name.first} ${user.name.last}</p>
                <p>Gender: ${user.gender}</p>
                <p>Age: ${user.dob.age}</p>
                <p>City: ${user.location.city}</p>
                <p>Country: ${user.location.country}</p>
                <button class='see-profile'>See Profile</button>
                <img class='heart' src=${user.like === true ? '../assets/heart-filled.png' : '../assets/heart-unfilled.png'} />
            </li>
        `;
}

function likeProfile(arr) {
    const hearts = document.querySelectorAll('.heart');

    hearts.forEach((heart, i) => {
        heart.addEventListener('click', () => {
            if (allUsersArr[i].like === false || allUsersArr[i].like === undefined) {
                allUsersArr[i].like = true;
                hearts[i].src = '../assets/heart-filled.png';
            } else if (allUsersArr[i].like === true) {
                allUsersArr[i].like = false;
                hearts[i].src = '../assets/heart-unfilled.png';
            }
            setLocalStorage('allUsers', arr);
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
function seeProfile(arr) {
    const seeprofileBtns = document.querySelectorAll('.see-profile');

    for (let i = 0; i < arr.length; i++) {
        seeprofileBtns[i].addEventListener('click', () => {
            setLocalStorage('otherUser', i);
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

    seeProfile(arr);
    likeProfile(arr);
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
    if (!JSON.parse(localStorage.getItem('loggedIn')) || localStorage.getItem('loggedIn') === null) {
        document.location.href = `http://localhost:${port}/login.html`;
    } else {
        callback();
    }
}