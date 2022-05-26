function goBack(btn) {
    const port = window.location.port;
    btn.addEventListener('click', () => {
        document.location.href = `http://localhost:${port}`;
    });
}

function otherUserProfile() {
    const allUsersLocal = JSON.parse(localStorage.getItem('allUsers'));
    const otherUser = document.querySelector('.other-users');
    const i = JSON.parse(localStorage.getItem('otherUser'));

    otherUser.innerHTML = `
        <li class='user-li'>
                <img class='user-img' src=${allUsersLocal[i].picture.large} />
                <p>Name: ${allUsersLocal[i].name.first} ${allUsersLocal[i].name.last}</p>
                <p>Gender: ${allUsersLocal[i].gender}</p>
                <p>Age: ${allUsersLocal[i].dob.age}</p>
                <p>City: ${allUsersLocal[i].location.city}</p>
                <p>Country: ${allUsersLocal[i].location.country}</p>
                <button class='go-back-btn'>Go Back</button>
            </li>
    `;

    const goBackBtn = document.querySelector('.go-back-btn');
    goBack(goBackBtn);
}

otherUserProfile();