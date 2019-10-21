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
            let weatherIcon = data.currently.icon;
            let currently = data.currently.summary;
            let tempHigh = data.daily.data[0].temperatureHigh;
            let tempLow = data.daily.data[0].temperatureLow;
            let windSpeed = data.currently.windSpeed;
            let windGust = data.currently.windGust;
            let windBearing = data.currently.windBearing;
            let windDirection = getWindDirection(windBearing);
            // ^ Get variables from the dark sky data.

            for (var i = 0; i < 2; i++) {
                templateHTML = templateHTML.replace("@@color" + i + "@@", getFontColor(weatherIcon));
                // ^ Set color to @@values@@ of location and temperature
            }
            templateHTML = templateHTML.replace("@@location@@", city + ", " + region);
            templateHTML = templateHTML.replace("@@temperature@@", Math.round(temperature));
            templateHTML = templateHTML.replace("@@imageURL@@", "../IMG/" + weatherIcon + ".jpg");
            templateHTML = templateHTML.replace("@@currently@@", currently);
            templateHTML = templateHTML.replace("@@high@@", Math.round(tempHigh));
            templateHTML = templateHTML.replace("@@low@@", Math.round(tempLow));
            templateHTML = templateHTML.replace("@@wind@@", windDirection + " " + Math.round(windSpeed) + " MPH, Gust: " + Math.round(windGust) + " MPH");
            // ^ Replace the string "@@value@@" with the Dark sky data we pass into this function in the HTML.

            for (var i = 0; i < 5; i++) {
                let dailyData = data.daily.data[i];


                if (i > 0) {
                    let date = new Date();
                    date.setDate(date.getDate() + i);
                    // ^ Get Dates for each day

                    let month = date.getMonth() + 1;
                    let day = date.getDay();
                    
                    templateHTML = templateHTML.replace("@@date" + i + "@@", month + "/" + day);
                }
                // ^ Set the Date

                dailySummary = dailyData.summary;
                dailyHigh = dailyData.temperatureMax;
                dailyLow = dailyData.temperatureMin;
                dailyPrecip = dailyData.precipProbability;

                templateHTML = templateHTML.replace("@@summary" + i + "@@", dailySummary);
                templateHTML = templateHTML.replace("@@max" + i + "@@", Math.round(dailyHigh));
                templateHTML = templateHTML.replace("@@low" + i + "@@", Math.round(dailyLow));
                templateHTML = templateHTML.replace("@@precip" + i + "@@", Math.round(dailyPrecip * 100));
            }

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

function getFontColor(weatherIcon) {
    switch (weatherIcon) {
        case "rain": 
        case "clear-night": 
        case "cloudy": 
        case "partly-cloudy-night":
            return "white";
        default:
            return "black";
    }
}
// ^ Set color of text location and temperature depending on background image.

function getWindDirection(windBearing) {
    switch (true) {
        case (windBearing > 315 || windBearing < 45):
            if (windBearing <= 338.5) {
                return "NW";
            } else if (windBearing >= 22.5) {
                return "NE";
            } else {
                return "N";
            }
        case (windBearing >= 45 && windBearing <= 135):
            if (windBearing <= 68.5) {
                return "NE";
            } else if (windBearing >= 112.5) {
                return "SE";
            } else {
                return "E";
            }
        case (windBearing > 135 && windBearing < 225):
            if (windBearing <= 158.5) {
                return "SE";
            } else if (windBearing >= 202.5) {
                return "SW";
            } else {
                return "S";
            }
        case (windBearing >= 225 && windBearing <= 315):
            if (windBearing <= 248.5) {
                return "SW";
            } else if (windBearing >= 292.5) {
                return "NW";
            } else {
                return "W";
            }
    }
}
// ^ Set cardinal direction for windBearing.

