
// fetch('https://api.openweathermap.org/data/2.5/onecall?lat=40.7306108&lon=-73.935242&exclude=minutely,hourly,daily&appid=d117205a71a6b575ea96d54ece944641')
//     .then(response => response.json())
//     .then(data => console.log(data));


var searchInput = document.querySelector('#search-textbox');
var searchButton = document.querySelector('#search-button');

var weatherTodayDivContent = document.querySelector('.weather-today-content');
weatherTodayDivContent.style.display = 'none';

var forecastContents = document.querySelectorAll('.forecast-contents');
for (var i = 0; i < forecastContents.length; i++) {
    forecastContents[i].style.display = 'none';
}


var apiKey = "d117205a71a6b575ea96d54ece944641"

var getCurrentWeather = function (searchValue) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput.value + "&units=imperial" + "&appid=" + apiKey;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            weatherTodayDivContent.style.display = 'block';

            // //get city name & current date            
            var dateFormat = new Date();
            var currentDay = dateFormat.getMonth() + 1 + '/' + dateFormat.getDate() + '/' + dateFormat.getFullYear();
            // console.log(currentDay)

            var cityDiv = document.querySelector('.city');
            var cityName = cityDiv.querySelector('.city-name');
            cityName.innerHTML = data.name + ' ' + '(' + currentDay + ')';

            var icon = cityDiv.querySelector('.weather-icon');
            icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";



            //get temperature
            var temp = document.querySelector('.temp');
            temp.textContent = "Temperature: " + data.main.temp + "℉";


            //get wind
            var wind = document.querySelector('.wind');
            wind.textContent = "Wind: " + data.wind.speed + " MPH";

            //get humitidy
            var humidity = document.querySelector('.humidity');
            humidity.textContent = "Humidity: " + data.main.humidity + " %";

            //get UV Index
            var lon = data.coord.lon;
            var lat = data.coord.lat;
            var uvQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts" + "&units=imperial" + "&appid=" + apiKey;

            fetch(uvQueryURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);

                  
                    uvIndexRate = data.daily[0].uvi
                    var uviIndex = document.querySelector('.uvindex');
                    var uvValue = uviIndex.querySelector('.uv-value');
                    uvValue.textContent = uvIndexRate


                    if (data.current.uvi < 4) {
                        uvValue.setAttribute('class', 'uv-value uv-favorable')
                    }
                    else if (data.current.uvi >= 4 && data.current.uvi < 8) {
                        uvValue.setAttribute('class', 'uv-value uv-moderate')
                    }
                    else {
                        uvValue.setAttribute('class', 'uv-value uv-severe')
                    }

                    var forecastContents = document.querySelectorAll('.forecast-contents');

                    for (var i = 0; i < forecastContents.length; i++) {
                        var forecastContent = forecastContents[i];
                        forecastContent.style.display = 'block';

                        var daily = data.daily[i + 1];

                        caculateDate = daily.dt;
                        var getDate = new Date(caculateDate * 1000);
                        var month = getDate.getMonth() + 1;
                        var date = getDate.getDate();
                        var year = getDate.getFullYear();
                        var futureDate = month + '/' + date + '/' + year;

                        forecastContent.querySelector('.future-date').innerHTML = futureDate;

                        // var futureIconDiv = forecastContent.querySelector('.future-icon')
                        // futureIconDiv.src = "https://openweathermap.org/img/wn/" + daily.icon + "@2x.png";
                        
                        // forecastContent.querySelector('.future-icon').innerHTML =


                        // var icon = cityDiv.querySelector('.weather-icon');
                        // icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
            

                        var futureTemp = daily.temp.day;
                        forecastContent.querySelector('.future-temp').innerHTML = "Temperature: " + futureTemp + "℉";

                        var futureWind = daily.wind_speed;
                        forecastContent.querySelector('.future-wind').innerHTML = "Wind: " + futureWind + " MPH";

                        var futureHumidity = daily.humidity;
                        forecastContent.querySelector('.future-humidity').innerHTML = "Humidity: " + futureHumidity + " %";
                    }

                })

        })


}


var appName = 'weather-app';
searchButton.addEventListener("click", function () {
    var cityName = searchInput.value;
    getCurrentWeather(cityName);

    // ["new york", "florida"]
    var history = [];
    var existingHistory = localStorage.getItem(appName);

    if (existingHistory === null) {
        history = [cityName];
        localStorage.setItem(appName, JSON.stringify(history));
    } else {
        history = JSON.parse(existingHistory);
        history.push(cityName);

        localStorage.setItem(appName, JSON.stringify(history));
    }

    var cities = document.querySelector('.cities');

    cities.innerHTML = '';

    for (var i = 0; i < history.length; i++) {
        var item = history[i];
        var input = document.createElement('input');
        input.type = 'button';
        input.value = item;

        cities.appendChild(input);
    }
});