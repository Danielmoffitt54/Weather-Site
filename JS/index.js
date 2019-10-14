(function () {
    getWeatherInfo();
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

}
// ^ Function to connect the MapQuest Geocoding API and get geocoding data.