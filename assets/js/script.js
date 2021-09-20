//This function should be renamed to differentiate between giphy api request and the weather api request
function sendApiRequest() {  // promise 
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



    fetch(giphyApiURL).then(function(data) {// pulling data from GIPHY 
    return data.json() // returns data 
    })
    .then(function(json){
    console.log(json.data[0].images.fixed_height.url) // this will alow us to filter down to what we're looking for from the GIPHY api: images, normal height and url to display GIF to browser
    var imgPath = json.data[0].images.fixed_height.url // associated to the how the GIF is dislayed in the browser
    var img = document.createElement("img") 

    img.setAttribute("src", imgPath) 
    document.body.appendChild(img) // appends image to the browser 
    })
}

function weatherRatingCheck(){
    // Code to do weather rating check goes here
    // Weather rating to start at 100  
}

function gifCategory(){
    // Code to decide what category to use goes here 
    // Aiming for 5 categories 
    // Mad, Sad , Relaxed, Happy, Excited (subject to change)

    if (weatherRating<25){
        //mad  category
    } else if(weatherRating<50){
        //sad category
    } else if(weatherRating<75){
        //relaxed category
    } else if(weatherRating<100){
        // happy category 
    } else {
        //Excited category
    }

}