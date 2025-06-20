document.addEventListener("DOMContentLoaded", () => {
    const userTab = document.querySelector("[data-userweather]"); 
    const searchTab = document.querySelector("[data-searchweather]"); 
    const grantAccessButton = document.querySelector("[data-grantAccess]");
    const searchInput = document.querySelector("[data-searchInput]");
    const searchForm = document.querySelector("[data-searchForm]"); 
    const cityname = document.querySelector("[data-name]"); 
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherdesc = document.querySelector("[data-weatherdesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    const loadingScreen = document.querySelector(".loading-container");
    const grantAccessContainer = document.querySelector(".grant-loc-container");
    const userInfoContainer = document.querySelector(".user-info-container");

   
    if (!userTab || !searchTab || !searchForm ) {
        console.error("One or more elements are missing from the DOM.");
        return;
    }

    let currentTab = userTab;
    const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
    currentTab.classList.add("current-tab");
    getfromSessionStorage();

    function switchTab(clickedTab) {
        if (currentTab !== clickedTab) {
            if (!currentTab || !clickedTab) {
                console.error("Error: Tab element not found.");
                return;
            }

            currentTab.classList.remove("active");
            currentTab = clickedTab;
            currentTab.classList.add("active");

            if (!searchForm.classList.contains("active")) {
                userInfoContainer.classList.remove("active");
                grantAccessContainer.classList.remove("active");
                searchForm.classList.add("active");
            } else {
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");
                getfromSessionStorage();
            }
        }
    }

    userTab.addEventListener("click", () => switchTab(userTab));
    searchTab.addEventListener("click", () => switchTab(searchTab));

    function getfromSessionStorage() {
        let localCoordinates = sessionStorage.getItem("user-coordinates");
        if (!localCoordinates) {
            grantAccessContainer.classList.add("active");
        } else {
            const coordinates = JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
    }

    async function fetchUserWeatherInfo(coordinates) {
        const { lat, lon } = coordinates;
        grantAccessContainer.classList.remove("active");
        loadingScreen.classList.add("active");

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const data = await response.json();

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            loadingScreen.classList.remove("active");
            alert("PLEASE PROVIDE ACCURATE INFO");
        }
    }

    function renderWeatherInfo(weatherInfo) {
        if (!weatherInfo || !weatherInfo.name) {
            console.error("Invalid weather data received.");
            return;
        }

        cityname.innerText = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo.sys.country.toLowerCase()}.png`;
        weatherdesc.innerText = weatherInfo?.weather?.[0]?.description;
        temp.innerText = `${weatherInfo?.main?.temp} °C`;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo.weather[0].icon}.png`;
        windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText = `${weatherInfo?.main?.humidity}%`;
        cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
    }

    function getlocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("No Geolocation Support Available");
        }
    }

    function showPosition(position) {
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
    }

    grantAccessButton.addEventListener("click", getlocation);

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let cityname = searchInput.value;
        if (cityname === "") return;
        fetchUserSearchInfo(cityname);
    });

    async function fetchUserSearchInfo(city) {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` );
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } catch (err) {
            alert("Inaccurate data");
        }
    }
});
