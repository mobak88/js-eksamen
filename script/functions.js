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
    return userList.innerHTML += `
            <li class='user-li'>
                <img class='user-img' src=${user.picture.large} />
                <p>${user.name.first} ${user.name.last} </p>
                <p>${user.gender}</p>
                <p>${user.dob.age}</p>
                <button>See Profile</button>
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