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
const days = [
  ["воскресенье", "ВС"],
  ["понедельник", "ПН"],
  ["вторник", "ВТ"],
  ["среда", "СР"],
  ["четверг", "ЧТ"],
  ["пятница", "ПТ"],
  ["суббота", "СБ"],
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

function getWeather(city = "Самарканд", nowDate) {
  const api = "ee2272ff977853a19e993cfe232d6a94";
  const searchUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&lang=ru&limit=1&appid=${api}`;
  fetch(searchUrl).then((response) => {
    response.json().then((data) => {
      try {
        if (data.length == 0) {
          throw new Error("Такого города не существует");
        }
        const urlCnt = `https://api.openweathermap.org/data/2.5/forecast?metric=standart&lat=${data[0].lat}&lon=${data[0].lon}&appid=${api}`;
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&lang=ru&units=metric&appid=${api}`;
        fetch(url).then((response) => {
          response.json().then((data) => {
            const date = new Date();

            document.getElementById("city").textContent = `${
              data.sys.country
            } / ${
              city[0].toUpperCase() +
              city.slice(1, city.length).toLocaleLowerCase()
            }`;
            document.getElementById("time").textContent = `${
              date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
            }:${
              date.getMinutes() < 10
                ? "0" + date.getMinutes()
                : date.getMinutes()
            }`;
            document.getElementById("date").textContent = `${
              days[date.getDay()][0]
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
            setTimeout(() => {
              // document.getElementById("compas").animate(
              //   [
              //     { transform: "translate(-50%, -50%) rotate(-45deg)" },
              //     {
              //       transform: `translate(-50%, -50%) rotate(${
              //         -45 + Number(data.wind.deg)
              //       }deg)`,
              //     },
              //   ],
              //   {
              //     duration: 1000,
              //   }
              // );
              document.getElementById(
                "compas"
              ).style.transform = `translate(-50%, -50%) rotate(${
                -45 + Number(data.wind.deg)
              }deg)`;
            }, 2000);
            let type = data.weather[0].main.toLowerCase();
            main.style.backgroundImage = `url(${photos[type]})`;
            getSomeData(urlCnt, data, nowDate);
          });
        });
      } catch (e) {
        setTimeout(() => {
          alert(e.message);
        }, 1000);
        getWeather();
      }
    });
  });
}

function getSomeData(url, nowData, nowDate) {
  fetch(url).then((response) => {
    response.json().then((data) => {
      let string = `<div class="other-time__block time-block">
                  <div class="time-block__img">
                    <img src="${
                      photosOther[nowData.weather[0].main.toLowerCase()]
                    }" alt="${nowData.weather[0].main.toLowerCase()}" />
                  </div>
                  <div class="time-block__text">
                    <p>Сейч.</p>
                  </div>
                  <div class="time-block__number">${nowData.main.temp}&deg</div>
                </div>`;
      const newData = data.list.filter(
        (element) => element["dt_txt"].slice(0, 10) == nowDate
      );

      for (let index = 0; index < newData.length; index++) {
        string += `<div class="other-time__block time-block">
        <div class="time-block__img">
          <img src="${
            photosOther[newData[index].weather[0].main.toLowerCase()]
          }" alt="${newData[index].weather[0].main.toLowerCase()}" />
        </div>
        <div class="time-block__text">
          <p>${newData[index]["dt_txt"].split(" ")[1].slice(0, 5)}</p>
        </div>
        <div class="time-block__number">${(
          Number(newData[index].main.temp) - 273.15
        ).toFixed(2)}&deg</div>
      </div>`;
      }
      document.getElementById("time-block").innerHTML = string;
      getSomeDays(data, nowDate);
    });
  });
}

function getSomeDays(data, nowDate) {
  const filterArrNow = data.list.filter((element) => {
    let [date, time] = element["dt_txt"].split(" ");
    return date === nowDate && (time === "15:00:00" || time === "21:00:00");
  });
  const filterArray = {
    _result: null,
    get array() {
      if (this._result === null) {
        const array = data.list.filter((element) => {
          let [date, time] = element["dt_txt"].split(" ");
          return (
            date !== nowDate && (time === "15:00:00" || time === "21:00:00")
          );
        });
        const newArray = [];
        for (let index = 0; index < array.length - 1; index += 2) {
          newArray.push([array[index], array[index + 1]]);
        }
        this._result = newArray;
        return this._result;
      }
      return this._result;
    },
  };
  let string = `<div class="other-day__block">
                  <div class="other-day__img">
                    <img src="${
                      photosOther[filterArrNow[0].weather[0].main.toLowerCase()]
                    }" alt="${filterArrNow[0].weather[0].main.toLowerCase()}" />
                  </div>
                  <div class="other-day__text">
                    <p>Сегодня</p>
                  </div>
                  <div class="other-day__number">
                    <p>${(Number(filterArrNow[0].main.temp) - 273.15).toFixed(
                      1
                    )}&deg</p>
                    <p>|</p>
                    <p>${(Number(filterArrNow[1].main.temp) - 273.15).toFixed(
                      1
                    )}&deg</p>
                  </div>
                </div>`;
  for (let index = 0; index < filterArray.array.length; index++) {
    let [date, time] = filterArray.array[index][0]["dt_txt"].split(" ");
    let img =
      photosOther[filterArray.array[index][0].weather[0].main.toLowerCase()];

    let numberDay = new Date(date).getDay();
    string += `<div class="other-day__block">
                  <div class="other-day__img">
                    <img src="${img}" alt="" />
                  </div>
                  <div class="other-day__text">
                    <p>${days[numberDay][1]}</p>
                  </div>
                  <div class="other-day__number">
                    <p>${(
                      Number(filterArray.array[index][0].main.temp) - 273.15
                    ).toFixed(1)}&deg</p>
                    <p> | </p>
                    <p>${(
                      Number(filterArray.array[index][1].main.temp) - 273.15
                    ).toFixed(1)}&deg</p>
                  </div>
                </div>`;
  }
  document.getElementById("day-blocks").innerHTML = string;
  //new Date("2025-04-12").getDay()
}

function getNowDate() {
  const date = new Date();
  const nowDate = date.toJSON().slice(0, 10);
  return nowDate;
}

function getCity(e) {
  if (e.key === "Enter") {
    // document.getElementById("mainCon").animate(
    //   [
    //     {
    //       opacity: 0,
    //       transform: "translateY(-20%)",
    //     },
    //   ],
    //   {
    //     duration: 1000,
    //   }
    // );
    document.getElementById("mainCon").style.transform = "translateY(-20%)";
    document.getElementById("mainCon").style.opacity = 0;
    getWeather(input.value, getNowDate());
    setTimeout(() => {
      // document.getElementById("mainCon").animate(
      //   [
      //     {
      //       opacity: 1,
      //       transform: "translateY(0)",
      //     },
      //   ],
      //   {
      //     duration: 1000,
      //   }
      // );
      document.getElementById("mainCon").style.transform = "translateY(0)";
      document.getElementById("mainCon").style.opacity = 1;
    }, 1500);

    input.value = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const nowDate = getNowDate();
  getWeather("Самарканд", nowDate);
});

input.addEventListener("keypress", getCity);
