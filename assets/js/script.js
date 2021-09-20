// WHAT DATA WE ARE USING FOR WEATHER BOX: city + temp + icon + uv index 
// Group key=> a3be7588e2f22d761077e844f13fff0c
// API INFO: https://openweathermap.org/
// API link for current data: https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API key}&units=imperial
// API link for hourly: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}&units=imperial
// API link for 5-day forecast: https://api.openweathermap.org/data/2.5/forecast?q={CITY}&appid={API key}+&units=imperial
// API link for icons: https://openweathermap.org/img/wn/{ICON ID}@2x.png

// BOXES SHOULD CONTAIN: ICON + TEMP + WIND + HUMIDITY + UVINDEX
// UPPER BOX: CURRENT + NEXT FOUR DAYS


// Declaring variables
var button = document.querySelector('.searchButton')
var inputValue = document.querySelector('.searchInput')

var cityValue = document.querySelector('.city')
var tempValue = document.querySelector('.temp')
var humidValue = document.querySelector('.humidity')
var descValue = document.querySelector('.desc')
var windValue = document.querySelector('.wind')
var uvIndexValue = document.querySelector('.uvIndex')
// vars to hide and display weather and Gif boxes
var weatherDisplayBox = document.querySelector('.weatherDisplayBox')

button.addEventListener('click', function() {
    // fetching current conditions
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=a3be7588e2f22d761077e844f13fff0c'+"&units=imperial")
    .then(response => response.json())
    .then(response => {
        // editing inner html 
        cityValue.innerHTML = response.name+" today";
        tempValue.innerHTML = "Temp: "+response.main.temp+"°F";
        humidValue.innerHTML = "HUM: "+response.main.humidity+" %";
        windValue.innerHTML = "Wind: "+response.wind.speed+" MPH";
        getUvi(response.coord.lat, response.coord.lon)

        //icon property
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        $(descValue).html("<img src="+iconurl+">");

        // showing weather box and current weather box after click
        weatherDisplayBox.style.display="block";
    })
})

// function to establish latitude and longitude to pull uvi data
function getUvi(lat, lon){
    var getUviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon +"&exclude=minutely,hourly,alerts&appid=a3be7588e2f22d761077e844f13fff0c"+"&units=imperial"
    // fetching one call
    fetch(getUviUrl)
    .then(response => response.json())
    .then(response => {
    // innerhtml for index value
    uvIndexValue.innerHTML = "UVI: "+response.current.uvi;
    Nextdaysforecast(response.daily)
    })
}


function Nextdaysforecast(NextDays){
    // console.log(NextDays)
     var getNextDaysUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+inputValue.value+'&appid=a3be7588e2f22d761077e844f13fff0c'+"&units=imperial"
    $.ajax({
        url:getNextDaysUrl,
        method:"GET"
    })
    .then(function(response){
    // loop to run through next days
    for (let i=1; i < 6; i++) {
        console.log("this is day",NextDays[i])
        var day = moment.unix(NextDays[i].dt).format("MM/DD/YYYY")
        var temp = "Temp: "+response.list[i+1].main.temp;
        var clouds = "Clouds: "+response.list[i+1].clouds.all;
        var wind ="Winds: "+ response.list[i+1].wind.speed;
        var humidity ="HUM: "+response.list[i+1].main.humidity;
        // /icon property
        var weathericon= response.list[i+1].weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        
        // editing inner html 
        $("#day-"+i).html(day);
        $("#desc-"+i).html("<img src="+iconurl+">");
        $("#temp-"+i).html(temp+"°F");
        $("#clouds-"+i).html(clouds+" %");
        $("#wind-"+i).html(wind+" MPH");
        $("#humidity-"+i).html(humidity+" %");
    }
    })
}

