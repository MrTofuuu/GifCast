// Declaring variables
var button = document.querySelector('.searchButton')
var inputValue = document.querySelector('.searchInput')

var cityValue = document.querySelector('.city')
var tempValue = document.querySelector('.temp')
var humidValue = document.querySelector('.humidity')
var descValue = document.querySelector('.desc')
var windValue = document.querySelector('.wind')
var uvIndexValue = document.querySelector('#uvi-0')
    // vars to hide and display weather and Gif boxes
var weatherDisplayBox = document.querySelector('.weatherDisplayBox')

var weatherRating = 50;
var category;
var fullForecast = [];


let history = ['Dallas', 'Fort Worth', 'New York', 'Los Angeles', 'Tokyo']


function getGif(category, index) { // promise 
    // recieved api through GIPHY Developers
    var giphyApiURL = 'https://api.giphy.com/v1/gifs/search?q=' + category + '&api_key=c44438D7l3N66PdiRNPzhTnWRjsJkBaw'
    console.log("weather rating is " + weatherRating);
    console.log("category is " + category);
    console.log("URL used for api call " + giphyApiURL);
    fetch(giphyApiURL)
        .then(function(response) {
            //console.log("giphy response");
            //console.log(response.ok);
            if (response.ok) {
                //console.log(response);
                // JSON parse
                response.json().then(function(data) {
                    //console.log(data);
                    //console.log("This is the data from giphy");
                    // path for GIFs
                    console.log(data.data)
                    //Random GIF pull from category
                    let randomNum = Math.floor(Math.random() * 51)
                    var imgPath = data.data[randomNum].images.fixed_width.url;
                    //console.log("used image path is " + imgPath);
                    // this allows pulls from the HMTL gif 
                    let img = document.getElementsByClassName('gif')[index]
                        //console.log(img)
                    img.setAttribute("src", imgPath)
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getGif: Invalid Connection');
        });
}

function weatherRatingCheck(temp, wind, humidity, uv) {
    // Code to do weather rating check goes here
    // Weather rating to start at 50
    if (temp < 60) { weatherRating - 15; };
    if (temp > 95) { weatherRating - 15; };
    if (temp < 87 && temp > 80) { weatherRating + 15; };
    if (wind > 15) { weatherRating - 15; };
    if (wind < 5) { weatherRating + 15; };
    if (uv > 5 && uv < 8) { weatherRating - 7; };
    if (uv > 7) { weatherRating - 15; };
    if (humidity > 60) { weatherRating - 7; };
    // if (raining) { weatherRating - 20; };
    // if (snowing) { weatherRating - 50; };
    console.log("this is inside weather rating check "+weatherRating);
    return weatherRating;

}

function gifCategory(weatherRating) { // added an arguement to align with if statements 
    // Code to decide what category to use goes here 
    // Aiming for 5 categories 
    // Mad, Sad , Relaxed, Happy, Excited (subject to change)

    if (weatherRating < 25) { // rating is by temp 
        //mad  category
        category = 'mad';
    } else if (weatherRating < 50) {
        //sad category
        category = 'sad'
    } else if (weatherRating < 75) {
        //relaxed category
        category = 'relaxed';
    } else if (weatherRating < 100) {
        // happy category
        category = 'happy';
    } else {
        //Excited category
        category = 'excited';
    }
    // returns the gif category
    return category;
}

//  WEATHER LOGIC BELOW //
//  WEATHER LOGIC BELOW //
function getLocation(city) {
    // fetching current conditions

    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=a3be7588e2f22d761077e844f13fff0c&units=imperial';
    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                //console.log(response);
                // JSON parse
                response.json().then(function(data) {
                    console.log(data)
                    getForecast(data.coord.lat, data.coord.lon, city)
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getLocation: Invalid Connection');
        });
}
// function to establish latitude and longitude to pull uvi data
function getForecast(lat, lon, city, NextDays) {
    //probably best to rename this 
    var getForecastUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&appid=a3be7588e2f22d761077e844f13fff0c&units=imperial"
        //     // fetching one call
        // Changing to catch errors
    fetch(getForecastUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    // innerhtml for index value
                    uvIndexValue.innerHTML = "UVI: " + data.current.uvi;
                    console.log("this is inside getForecast");
                    console.log(data.daily)

                    //code goes here for next days forecast
                    // loop to run through next days
                    fullForecast = []
                    cityValue.innerHTML = data.name + " today";
                    for (let i = 0; i < 6; i++) {
                        console.log("This is day " + i);
                        console.log(data.daily[i]);
                        // console.log("this is day", NextDays[i])
                        var day = moment.unix(data.daily[i].dt).format("MM/DD/YYYY")
                        var temp = "Temp: " + data.daily[i + 1].temp.day;
                        var uvi = "UVI: " + data.daily[i + 1].uvi;
                        var wind = "Winds: " + data.daily[i + 1].wind_speed;
                        var humidity = "HUM: " + data.daily[i + 1].humidity;
                        // /icon property
                        var weathericon = data.daily[i + 1].weather[0].icon;
                        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
                        // temp object to store info
                        console.log("api used for next" + getForecastUrl);
                        var forecastObj = {
                                temp: data.daily[i + 1].temp.day,
                                wind: data.daily[i + 1].wind_speed,
                                humidity: data.daily[i + 1].humidity,
                                uvi: data.daily[i + 1].uvi
                            }
                            //adding the forecastObj to the fullForecast array for use.
                        fullForecast.push(forecastObj);
                        console.log(fullForecast);
                        // editing inner html 
                        $("#day-" + i).html(day);
                        $("#desc-" + i).html("<img src=" + iconurl + ">");
                        $("#temp-" + i).html(temp + "°F");
                        $("#uvi-" + i).html(uvi);
                        $("#wind-" + i).html(wind + " MPH");
                        $("#humidity-" + i).html(humidity + " %");
                    }

                    // this fix lag in api call.
                    // for loop to get gif category 
                    setTimeout(function() {
                        for (let i = 0; i < 5; i++) {
                            console.log(fullForecast)
                            weatherRating = weatherRatingCheck(85, 5, 20, 3);
                            category = gifCategory(weatherRating);
                            getGif(category, i);
                        }
                    }, 1000)
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        }).catch(function(error) {
            alert('Unable to getForecast: Invalid Connection');
        });
}


// this will allow us run previous cities through an array
let previousCities = document.getElementById('previousCities').children
previousCities = Array.from(previousCities)
console.log(previousCities)

//for loop 
for (let i = 0; i < 5; i++) {
    previousCities[i].addEventListener("click", function(event) {
        //gif function will be added here 
        //automatically display the gif with weather 
        getLocation(previousCities[i].innerText)
    })
    previousCities[i].innerText = history[i]
}

button.addEventListener('click', function() {
    var city = inputValue.value;

    // this will push the recent search city in front of previous cities hard coded
    // unshift: places it in front 
    // hard code cities pulled from html: 
    history.unshift(city)
    for (let i = 0; i < 5; i++) {
        previousCities[i].innerText = history[i]
    }
    console.log(history)
    getLocation(city);
})


