const main = document.getElementById("main");
const input = document.getElementById("input");
const photos = {
  clouds: "./img/cloud.jpg",
  snow: "./img/snow.jpg",
  clear: "./img/clear.jpg",
  rain: "./img/rain.jpg",
};
const photosOther = {
  clouds: "./img/other/cloud.png",
  snow: "./img/other/snow.png",
  clear: "./img/other/clear.png",
  rain: "./img/other/rain.png",
};

function getSomeData(url, nowData) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      // let string = `<div class="other-time__block time-block">
      //             <div class="time-block__img">
      //               <img src="${
      //                 photosOther[data.main.toLowerCase()]
      //               }" alt="${data.main.toLowerCase()}" />
      //             </div>
      //             <div class="time-block__text">
      //               <p>Сейч.</p>
      //             </div>
      //             <div class="time-block__number">${data.main.temp}&deg</div>
      //           </div>`;
      const date = new Date();
      const newData = data.list.filter(
        (element) =>
          element["dt_txt"].slice(0, 10) == date.toJSON().slice(0, 10)
      );
      console.log(newData);

      console.log(data);
    });
  });
}

function getWeather(city = "Самарканд") {
  const api = "ee2272ff977853a19e993cfe232d6a94";
  const searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&lang=ru&limit=1&appid=${api}`;
  fetch(searchUrl).then((response) => {
    response.json().then((data) => {
      try {
        if (data.length == 0) {
          throw new Error("Такого города не существует");
        }
        const urlCnt = `https://api.openweathermap.org/data/2.5/forecast?lat=${data[0].lat}&lon=${data[0].lon}&appid=${api}`;
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&lang=ru&units=metric&appid=${api}`;
        fetch(url).then((response) => {
          response.json().then((data) => {
            const date = new Date();
            const days = [
              "воскресенье",
              "понедельник",
              "вторник",
              "среда",
              "четверг",
              "пятница",
              "суббота",
            ];
            const months = [
              "января",
              "февраля",
              "марта",
              "апреля",
              "мая",
              "июня",
              "июля",
              "августа",
              "сентября",
              "октября",
              "ноября",
              "декабря",
            ];
            document.getElementById(
              "city"
            ).textContent = `${data.sys.country} / ${data.name}`;
            document.getElementById(
              "time"
            ).textContent = `${date.getHours()}:${date.getMinutes()}`;
            document.getElementById("date").textContent = `${
              days[date.getDay()]
            }, ${date.getDate()} ${
              months[date.getMonth()]
            } ${date.getFullYear()}г.`;
            document.getElementById("number").textContent = `${data.main.temp}`;
            document.getElementById("wind").textContent = data.wind.speed;
            document.getElementById("description").textContent =
              data.weather[0].description;
            document.getElementById(
              "feels"
            ).textContent = `${data.main["feels_like"]}`;
            document.getElementById(
              "tempMin"
            ).textContent = `${data.main["temp_min"]}`;
            document.getElementById(
              "tempMax"
            ).textContent = `${data.main["temp_max"]}`;
            document.getElementById(
              "humidity"
            ).textContent = `${data.main.humidity}%`;
            document.getElementById(
              "pressure"
            ).textContent = `${data.main.pressure} мм`;
            document.getElementById("visibility").textContent = `${
              data.visibility / 1000
            } км`;
            document.getElementById("compas").animate(
              [
                { transform: "translate(-50%, -50%) rotate(-45deg)" },
                {
                  transform: `translate(-50%, -50%) rotate(${
                    -45 + Number(data.wind.deg)
                  }deg)`,
                },
              ],
              {
                duration: 1000,
              }
            );
            document.getElementById(
              "compas"
            ).style.transform = `translate(-50%, -50%) rotate(${
              -45 + Number(data.wind.deg)
            }deg)`;
            let type = data.weather[0].main.toLowerCase();
            main.style.backgroundImage = `url(${photos[type]})`;
          });
        });
        getSomeData(urlCnt, data);
      } catch (e) {
        setTimeout(() => {
          alert(e.message);
        }, 1000);
        getWeather();
      }
    });
  });
}

function getCity(e) {
  if (e.key === "Enter") {
    getWeather(input.value);
    input.value = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  getWeather();
});

input.addEventListener("keypress", getCity);
