fetch('https://api.openweathermap.org/data/2.5/onecall?lat= 40.71 & lon=74.00 & exclude=minutely, hourly & appid=current.weather')
  .then(response => response.json())
  .then(data => console.log(data));