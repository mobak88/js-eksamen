import { likeProfileHandler, allUsersArr } from './reusable-functions.js';
import TILE_API_KEY from './apikey.js';

const i = JSON.parse(localStorage.getItem('otherUser'));
const goBackBtn = document.querySelector('.go-back-btn');

function goBack(btn) {
    const port = window.location.port;
    btn.addEventListener('click', () => {
        document.location.href = `http://localhost:${port}`;
    });
}

function otherUserProfile() {
    const otherUser = document.querySelector('.other-users');

    otherUser.innerHTML = `
        <li class='user-li' id=${allUsersArr[i].login.uuid}>
            <h1>Profile</h1>
            <img class='user-img' src=${allUsersArr[i].picture.large} />
            <p>Name: ${allUsersArr[i].name.first} ${allUsersArr[i].name.last}</p>
            <p>Gender: ${allUsersArr[i].gender}</p>
            <p>Age: ${allUsersArr[i].dob.age}</p>
            <p>City: ${allUsersArr[i].location.city}</p>
            <p>Country: ${allUsersArr[i].location.country}</p>
            <div>
                <h2>Interests</h2>
                <p>Favourite animal: ${allUsersArr[i].quizAnswers.faouriteAnimal.animal}</p>
                <p>Favourite hobby: ${allUsersArr[i].quizAnswers.faouriteHobby.hobby}</p>
                <p>Favourite movie: ${allUsersArr[i].quizAnswers.faouriteMovie.movie}</p>
            </div>
            <img class='heart' src=${allUsersArr[i].like === true ? '../assets/heart-filled.png' : '../assets/heart-unfilled.png'} />
        </li>
    `;
}

function displayUserMap(lat, lon) {
    const map = L.map('map').setView([allUsersArr[i].location.coordinates.latitude, allUsersArr[i].location.coordinates.longitude], 14);

    const tileUrl = `https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}@2x.png?apiKey=${TILE_API_KEY}`;
    const tiles = L.tileLayer(tileUrl, {
        attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>'
    });
    tiles.addTo(map);
    L.marker([lat, lon]).addTo(map);
}

/* I had to get city coord with geolocation because the coords provided by the
   randomuser API gave wrong coords.
   Also if the below tile API does not work try to replace it with the free api: https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png */
async function getCityCoords() {
    try {
        const geolocationAPI = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${allUsersArr[i].location.city}&format=json&limit=1`;
        const response = await fetch(geolocationAPI);
        const data = await response.json();
        allUsersArr[i].location.coordinates.latitude = data[0].lat;
        allUsersArr[i].location.coordinates.longitude = data[0].lon;

        displayUserMap(data[0].lat, data[0].lon);
    } catch (err) {
        console.log(err);
    }
}

goBack(goBackBtn);
otherUserProfile();
likeProfileHandler();
getCityCoords();