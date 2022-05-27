const i = JSON.parse(localStorage.getItem('otherUser'));
const allUsersLocal = JSON.parse(localStorage.getItem('allUsers'));

function goBack(btn) {
    const port = window.location.port;
    btn.addEventListener('click', () => {
        document.location.href = `http://localhost:${port}`;
    });
}

function otherUserProfile() {
    const otherUser = document.querySelector('.other-users');

    otherUser.innerHTML = `
        <li class='user-li'>
                <img class='user-img' src=${allUsersLocal[i].picture.large} />
                <p>Name: ${allUsersLocal[i].name.first} ${allUsersLocal[i].name.last}</p>
                <p>Gender: ${allUsersLocal[i].gender}</p>
                <p>Age: ${allUsersLocal[i].dob.age}</p>
                <p>City: ${allUsersLocal[i].location.city}</p>
                <p>Country: ${allUsersLocal[i].location.country}</p>
            </li>
    `;

    const goBackBtn = document.querySelector('.go-back-btn');
    goBack(goBackBtn);
}

otherUserProfile();

function displayUserMap(lat, lon) {
    const map = L.map('map').setView([allUsersLocal[i].location.coordinates.latitude, allUsersLocal[i].location.coordinates.longitude], 14);

    const tileUrl = 'https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}@2x.png?apiKey=df373db52e2d4a2892c47b1cf7037ae5';
    const tiles = L.tileLayer(tileUrl);
    tiles.addTo(map);
    L.marker([lat, lon]).addTo(map);
}

/* I had to get city coord with geolocation because the coords provided by the
   randomuser API gave wrong coords.
   Also if the below tile API does not work try to replace it with the free api: https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png */
async function getCityCoords() {
    try {
        const geolocationAPI = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${allUsersLocal[i].location.city}&format=json&limit=1`;
        const response = await fetch(geolocationAPI);
        const data = await response.json();
        allUsersLocal[i].location.coordinates.latitude = data[0].lat;
        allUsersLocal[i].location.coordinates.longitude = data[0].lon;

        displayUserMap(data[0].lat, data[0].lon);
    } catch (err) {
        console.log(err);
    }
}

getCityCoords();