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

    $(document).on("click", "button#remove", function () {
        let parentDiv = $(this).parent();
        // ^ This refers to the element that triggered the event handler.

        let weatherCardContainer = parentDiv.parent();
        // ^ Get the parent of the clicked button container.

        weatherCardContainer.remove();
        // ^ Remove the container and all of its contents.
    });
})();

function geocode(location) {
    //Base-URL + APIkey + &location= + Address
    
    $.ajax("http://www.mapquestapi.com/geocoding/v1/address?key=" + mapQuestKey + "&location=" + location)
    .done(function(data) {
        console.log(data);
        if (data.results[0].locations.length > 10) {
            for (var i = 0; i < 9; i++) {
                let location = data.results[0].locations[i];
                let lat = location.latLng.lat;
                let lng = location.latLng.lng;
                let city = location.adminArea5;
                let state = location.adminArea3;
                let country = location.adminArea1;
                // ^ Get Lat, Lng, city and state from the response
                console.log("Country: " + country);

                if (country === "US") {
                    getWeatherInfo(lat, lng, city, state);
                    // ^ Pass the Lat and Long to our getWeatherInfo function.
                } else {
                    getWeatherInfo(lat, lng, city, country);
                    // ^ Pass the Lat and Long to our getWeatherInfo function.
                }
            }
            // ^ Iterate through 10 of the results inside location array length.
        } else {
            for (var i = 0; i < data.results[0].locations.length; i++) {
                let location = data.results[0].locations[i];
                let lat = location.latLng.lat;
                let lng = location.latLng.lng;
                let city = location.adminArea5;
                let state = location.adminArea3;
                let country = location.adminArea1;
                // ^ Get Lat, Lng, city and state from the response
                console.log("Country: " + country);

                if (country === "US") {
                    getWeatherInfo(lat, lng, city, state);
                    // ^ Pass the Lat and Long to our getWeatherInfo function.
                } else {
                    getWeatherInfo(lat, lng, city, country);
                    // ^ Pass the Lat and Long to our getWeatherInfo function.
                }
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

function getWeatherInfo(latitude, longitude, city, region) {
    //Base-URL/APIKey?Latitude,Longitude
    $.ajax("https://api.darksky.net/forecast/" + darkSkyKey + "/" + latitude + "," + longitude, { dataType: "jsonp" })
    .done(function(data) {
        console.log(data);

        if (city !== "" && region !== "") {
            let templateHTML = $("#template").html();
            // ^ Get the HTML from the div with the ID template.

            let temperature = data.currently.temperature;
            let currently = data.currently.summary;
            let tempHigh = data.daily.data[0].temperatureHigh;
            let tempLow = data.daily.data[0].temperatureLow;
            let precipiProb = data.currently.precipProbability;
            let humidity = data.currently.humidity;
            // ^ Get variables from the dark sky data.

            templateHTML = templateHTML.replace("@@city@@", city + ", " + region);
            templateHTML = templateHTML.replace("@@temperature@@", temperature + "&#8457");
            templateHTML = templateHTML.replace("@@currently@@", "Currently: " + currently);
            templateHTML = templateHTML.replace("@@high@@", "High Temp: " + tempHigh + "&#8457");
            templateHTML = templateHTML.replace("@@low@@", "Low Temp: " + tempLow + "&#8457");
            templateHTML = templateHTML.replace("@@precipiProb@@", "Precipitaion Probability: " + precipiProb + "%");
            templateHTML = templateHTML.replace("@@humidity@@", "Humidity: " + humidity);
            // ^ Replace the string "@@value@@" with the Dark sky data we pass into this function in the HTML.

            $(".row").append(templateHTML);
            // ^ Add the configured template HTML to our row in the card container.
        }
    })
    .fail(function(error) {
        console.log(error);
    })
    .always(function() {
        console.log("Weather call complete!");
    });
}
// ^ Function to connect to the Dark Sky API and get weather data.