(function () {
    //getWeatherInfo();
    geocode();
})();

function getWeatherInfo() {
    //Base-URL/APIKey?Latitude,Longitude
    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/37.8267,-122.4233", { dataType: "jsonp" })
    .done(function(data) {
        console.log(data);
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Weather call complete!");
    })
}
// ^ Function to connect to the Dark Sky API and get weather data.

function geocode() {
    //Base-URL + APIkey + &location= + Address
    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=Washington,DC")
    .done(function(data) {
        console.log(data);
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Geocoding call finished!");
    })
}
// ^ Function to connect the MapQuest Geocoding API and get geocoding data.