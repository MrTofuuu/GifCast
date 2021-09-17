// WHAT DATA WE ARE USING FOR WEATHER BOX: city + temp + icon + uv index 
// Group key=> a3be7588e2f22d761077e844f13fff0c
// API INFO: https://openweathermap.org/
// API link for current data: https://api.openweathermap.org/data/2.5/weather?q={CITY}&appid={API key}&units=imperial
// API link for hourly: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}&units=imperial
// API link for 5-day forecast: https://api.openweathermap.org/data/2.5/forecast?q={CITY}&appid={API key}+&units=imperial
// API link for icons: https://openweathermap.org/img/wn/{ICON ID}@2x.png


// Variables ... these need to be defined in html
var button = document.querySelector('.searchButton')
var inputValue = document.querySelector('.searchInput')

// NEED TO CONNECT THESE VARIABLES TO HTML
var cityValue = document.querySelector('.city')
var tempValue = document.querySelector('.temp')
var descValue = document.querySelector('.desc')
var uvIndexValue = document.querySelector('.uvIndex')


// PULLING DATA FOR CURRENT WEATHER
button.addEventListener('click', function() {
    // for current temperature
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&appid=a3be7588e2f22d761077e844f13fff0c'+"&units=imperial")
    .then(response => response.json())
    .then(response => {
       
        // NEED TO CHECK IF THESE ARE VALID ACCORDING TO DESIGN
        cityValue.innerHTML = response.name;
        tempValue.innerHTML = "Temperature: "+response.main.temp+"°F";

        //icon
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        $(descValue).html("<img src="+iconurl+">");

        // calling uvi after establishing connection to lat and long
        getUvi(response.coord.lat, response.coord.long)
    })
    // fetching lat and long for uvi data
    function getUvi(lat, long){
        var getUviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long +"&exclude=minutely,hourly,alerts&appid=a3be7588e2f22d761077e844f13fff0c"+"&units=imperial"
        fetch(getUviUrl)
        .then(response => response.json())
        .then(response => {
        // console.log(response)
        uvIndexValue.innerHTML = "UVI Index: "+response.current.uvi;
        // console.log(response.daily)
        // sending data to:
        Fivedayforecast(response.daily)
        })
    }
})


// PULLING DATA FOR 5-DAY FORECAST
function Fivedayforecast(fiveDay){
    // console.log(fiveDay)
     var getFiveUrl = 'https://api.openweathermap.org/data/2.5/forecast?q='+inputValue.value+'&appid=a3be7588e2f22d761077e844f13fff0c'+"&units=imperial"
    $.ajax({
        url:getFiveUrl,
        method:"GET"
    }).then(function(response){

    for (let i=1; i < 6; i++) {
        // console.log("this is day",fiveDay[i])
        var day = moment.unix(fiveDay[i].dt).format("MM/DD/YYYY")
        var temp = response.list[i+1].main.temp;
        // uv index will show as it was established inside the getUvi function
        // /icon property.
        var weathericon= response.list[i+1].weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        
   

        $("#day-"+i).html(day);
        $("#desc-"+i).html("<img src="+iconurl+">");
        $("#temp-"+i).html(temp+"°F");
        $("#wind-"+i).html(wind+" MPH");
        $("#humidity-"+i).html(humidity+" %");
    
    }
    })
}


// PULLING DATA FOR HOURLY


