(function () {
    $("#submit").click(function() {
        const searchLocation = $("#searchBar").val();
        // ^ Get the value the user has entered in the search bar and store it.

        if (searchLocation.length > 0) {
            geocode(searchLocation);
            // ^ Call the geocode function and pass in the value.
            $("#searchBar").val("");
            // ^ Clear current value of search bar.
        }
    });
    // ^ Submit Button Event Handler

    $("#searchBar").keydown(function(event) {
        const searchLocation = $("#searchBar").val();
        // ^ Get the value the user has entered in the search bar and store it.

        if (event.keyCode === 13 && searchLocation.length > 0) {
            event.preventDefault();
            // ^ Prevent screen refresh.
            geocode(searchLocation);
            // ^ Call the geocode function and pass in the value.
            $("#searchBar").val("");
            // ^ Clear current value of search bar.
        }
    });
    // ^ Hotkey Submit Button Event Handler 

})();

function getWeatherInfo(latitude, longitude, city, state) {
    //Base-URL/APIKey?Latitude,Longitude
    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp" })
    .done(function(data) {
        console.log(data);
        let temperature = data.currently.apparentTemperature;
        // ^ Get the current temperature.
        let precipiProb = data.currently.precipProbability;
        // ^ Get precipitation probability.
        let tempHigh = data.daily.data[0].temperatureHigh;
        let tempLow = data.daily.data[0].temperatureLow;
        // ^ Get the High and low temperature for the current day (first element in the data array in the daily object.)
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Weather call complete!");
    })
}
// ^ Function to connect to the Dark Sky API and get weather data.

function geocode(location) {
    //Base-URL + APIkey + &location= + Address
    
    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location)
    .done(function(data) {
        console.log(data);
        if (data.results[0].locations.length > 10) {
            for (var i = 0; i < 10; i++) {
                let locations = data.results[0].locations[i];
                let lat = locations.latLng.lat;
                let lng = locations.latLng.lng;
                let city = locations.adminArea5;
                let state = locations.adminArea3;
                // ^ Get Lat, Lng, city and state from the response

                getWeatherInfo(lat, lng, city, state);
                // ^ Pass the Lat and Long to our getWeatherInfo function.
            }
            // ^ Iterate through 10 of the results inside location array length.
        } else {
            for (var i = 0; i < data.results[0].locations.length; i++) {
                let locations = data.results[0].locations[i];
                let lat = locations.latLng.lat;
                let lng = locations.latLng.lng;
                let city = locations.adminArea5;
                let state = locations.adminArea3;
                // ^ Get Lat, Lng, city and state from the response

                getWeatherInfo(lat, lng, city, state);
                // ^ Pass the Lat and Long to our getWeatherInfo function.
            }
            // ^ Iterate through results location array length.
        }
        // ^ If result's location array length is greater than 10 only retrieve 10 locations, otherwise retrieve all.
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Geocoding call finished!");
    })
}
// ^ Function to connect the MapQuest Geocoding API and get geocoding data.