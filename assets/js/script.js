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


//This function should be renamed to differentiate between giphy api request and the weather api request
function sendApiRequest() { // promise 
    var userInput = document.getElementById("input").value
    console.log(userInput)

    var giphyApiKey = "c44438D7l3N66PdiRNPzhTnWRjsJkBaw" // recieved api through GIPHY Developers 
    var giphyApiURL = `https://api.giphy.com/v1/gifs/search?q={userInput}&api_key=$c44438D7l3N66PdiRNPzhTnWRjsJkBaw`
        //this will allow user to enter in word/name to pull GIFs from api 

    // api URL: https://api.giphy.com/v1/gifs/search?q=${userInput}&rating=g&api_key${giphyApiKey}

    // breakdown to api URL: 
    // q= (specifying what we're going to look for)
    // $ (endpoint)
    // & (separating)
    // ${giphyApiKey} (references api key)



    fetch(giphyApiURL).then(function(data) { // pulling data from GIPHY 
            return data.json() // returns data 
        })
        .then(function(json) {
            console.log(json.data[0].images.fixed_height.url) // this will alow us to filter down to what we're looking for from the GIPHY api: images, normal height and url to display GIF to browser
            var imgPath = json.data[0].images.fixed_height.url // associated to the how the GIF is dislayed in the browser
            var img = document.createElement("img")

            img.setAttribute("src", imgPath)
            document.body.appendChild(img) // appends image to the browser 
        })
}

function weatherRatingCheck() {
    // Code to do weather rating check goes here
    // Weather rating to start at 100  
}

function gifCategory() {
    // Code to decide what category to use goes here 
    // Aiming for 5 categories 
    // Mad, Sad , Relaxed, Happy, Excited (subject to change)

    if (weatherRating < 25) {
        //mad  category
    } else if (weatherRating < 50) {
        //sad category
    } else if (weatherRating < 75) {
        //relaxed category
    } else if (weatherRating < 100) {
        // happy category 
    } else {
        //Excited category
    }

}

//  WEATHER LOGIC BELOW //
//  WEATHER LOGIC BELOW //

button.addEventListener('click', function() {
    // fetching current conditions
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + inputValue.value + '&appid=a3be7588e2f22d761077e844f13fff0c' + "&units=imperial")
        .then(response => response.json())
        .then(response => {
            // editing inner html 
            cityValue.innerHTML = response.name + " today";
            tempValue.innerHTML = "Temp: " + response.main.temp + "°F";
            humidValue.innerHTML = "HUM: " + response.main.humidity + " %";
            windValue.innerHTML = "Wind: " + response.wind.speed + " MPH";
            getUvi(response.coord.lat, response.coord.lon)

            //icon property
            var weathericon = response.weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
            $(descValue).html("<img src=" + iconurl + ">");

            // showing weather box and current weather box after click
            weatherDisplayBox.style.display = "block";
        })
})

// function to establish latitude and longitude to pull uvi data
function getUvi(lat, lon) {
    var getUviUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=a3be7588e2f22d761077e844f13fff0c" + "&units=imperial"
        // fetching one call
    fetch(getUviUrl)
        .then(response => response.json())
        .then(response => {
            // innerhtml for index value
            uvIndexValue.innerHTML = "UVI: " + response.current.uvi;
            Nextdaysforecast(response.daily)
        })
}


function Nextdaysforecast(NextDays) {
    // console.log(NextDays)
    var getNextDaysUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + inputValue.value + '&appid=a3be7588e2f22d761077e844f13fff0c' + "&units=imperial"
    $.ajax({
            url: getNextDaysUrl,
            method: "GET"
        })
        .then(function(response) {
            // loop to run through next days
            for (let i = 1; i < 6; i++) {
                console.log("this is day", NextDays[i])
                var day = moment.unix(NextDays[i].dt).format("MM/DD/YYYY")
                var temp = "Temp: " + response.list[i + 1].main.temp;
                var clouds = "Clouds: " + response.list[i + 1].clouds.all;
                var wind = "Winds: " + response.list[i + 1].wind.speed;
                var humidity = "HUM: " + response.list[i + 1].main.humidity;
                // /icon property
                var weathericon = response.list[i + 1].weather[0].icon;
                var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

                // editing inner html 
                $("#day-" + i).html(day);
                $("#desc-" + i).html("<img src=" + iconurl + ">");
                $("#temp-" + i).html(temp + "°F");
                $("#clouds-" + i).html(clouds + " %");
                $("#wind-" + i).html(wind + " MPH");
                $("#humidity-" + i).html(humidity + " %");
            }
        })
}