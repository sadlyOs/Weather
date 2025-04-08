const main = document.getElementById('main')
const photos = {
    clouds: "./img/cloud.jpg",
    snow: "./img/snow.jpg",
    clear: "./img/clear.jpg"
}


function getWeather(city) {
    const api = "ee2272ff977853a19e993cfe232d6a94"
    const searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&lang=ru&limit=1&appid=${api}`
    fetch(searchUrl).then((response) => {
        response.json().then((data) => {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${api}`
            console.log(data);
            fetch(url).then(response => {
                response.json().then(data => {
                    console.log(data);
                    // console.log(data.weather[0].main);
                 
                    let type = data.weather[0].main.toLowerCase()
                    main.style.backgroundImage = `url(${photos[type]})`
                })
            })
        })
    })
}

// getWeather('Хива')