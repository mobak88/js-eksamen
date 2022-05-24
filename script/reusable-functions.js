export const userList = document.querySelector('.users-list');

export async function fetchData(apiData, arr, callback) {
    try {
        const response = await fetch(apiData);
        const data = await response.json();
        arr.push(...data.results);
        callback(arr);
    }
    catch (err) {
        console.log(err);
    }
}

function usersTemplate(user) {
    userList.innerHTML += `
            <li class='user-li'>
                <img class='user-img' src=${user.picture.large} />
                <p>Name: ${user.name.first} ${user.name.last}</p>
                <p>Gender: ${user.gender}</p>
                <p>Age: ${user.dob.age}</p>
                <p>City: ${user.location.city}</p>
                <p>Country: ${user.location.country}</p>
                <button class='see-profile'>See Profile</button>
                <img class='heart' src='../assets/heart-unfilled.png' />
            </li>
        `;
}

export function displayUsers(arr) {
    arr.forEach((user) => {
        usersTemplate(user);
    });
}

export function clearHTML(element) {
    element.innerHTML = '';
}

export function firstLetterToUpperCase(userInput) {
    return userInput.charAt(0).toUpperCase() + userInput.slice(1);
}