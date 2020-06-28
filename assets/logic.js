/*Global Variables*/
// sidenav elements
var citySearchForm = $("#citySearchForm");
var cityInput = $("#cityInput");
var searchedCitysGroup = $("#cityHistoryBtns");

var cityHist;

//main content elements
var curWeatherCard = $("#curWeatherCard");
var dayForcastDiv = $("#dayForcast");

//OpenWeather
var authKey = "6b1f3503a9686063d7fa4518108b400c";
var dayforcastQry = "https://api.openweathermap.org/data/2.5/forecast?appid="+authKey+"&q=";
var curWeatherQry = "https://api.openweathermap.org/data/2.5/weather?appid="+authKey+"&q=";
var uvQry = "https://api.openweathermap.org/data/2.5/uvi?appid="+authKey;



/*Functions*/
function printButtons(){
    //clear previous buttons
    searchedCitysGroup.empty();

    for(city of cityHist){
        searchedCitysGroup.prepend( $("<button/>",{class:"btn btn-secondary btn-white city-btn", 'data-city':city, text:city}) )
    }
    // print is called whenever buttons change, so it makes sense to add the save function here too
    saveHist();

}

function saveHist(){
    localStorage.setItem('history',JSON.stringify(cityHist));
}


function loadHist(){
    cityHist = JSON.parse(localStorage.getItem('history'));
    if(cityHist === null){
        cityHist = [];
    }
}


function kelvToF(temp){
    return ((temp - 273.15)*(9/5) + 32).toFixed(2);
}


function getIcon(weather){  
    weatherIcon = $("<i/>");
    //accounting for possibility of multiple weather icons, as described in the api documentation
    for (const elem of weather){
        weatherIcon.append( $("<img/>",{src:'http://openweathermap.org/img/wn/'+elem.icon+'@2x.png', alt:elem.description}))
    }
    return weatherIcon;
}

function getUV(response){
    //get the UV index via ajax call
    $.ajax({url:uvQry+"&lat="+response.coord.lat+"&lon="+response.coord.lon, method:"GET"})
    .then(function(uvresponse){
        //console.log(uvresponse);
        // scale index colors pulled from https://www.epa.gov/sunsafety/uv-index-scale-0
        var uv = uvresponse.value;
        var uvScale;

        //set class name based on severity of UV
        if(uv < 3 ){uvScale = "uvLow"}
        else if(uv < 6 ){uvScale = "uvMod"}
        else if(uv < 8 ){uvScale = "uvHi"}
        else if(uv < 11 ){uvScale = "uvVH"}
        else{uvScale = "uvEx"}
        
        //add index and appropriate class
        $("#uvDiv").append( $("<span/>",{class:"uv "+uvScale, text:uv}) );
    });
}


function printWeatherForCity(cityName){
   $.ajax({ 
        url:curWeatherQry+cityName,
        method:"GET",
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status==404) {
                curWeatherCard.empty();
                curWeatherCard.append($("<h4/>",{text: "I'm sorry, but '"+cityHist.pop()+"' could not be found by Open Weather API.  I took the liberty of removing this from your history.  Please try another city!" }));
                dayForcastDiv.empty();
                printButtons();
            }
        }
    })
    .then(function(response){
        //console.log(response);
        var time = moment();

        //clear previous information
        curWeatherCard.empty();

        // append data from JSON to DOM
        curWeatherCard.append([
            $("<div/>",{class:"card-header text-center m-0 h-3", text:time.format('ddd MMMM Do YYYY, h:mm a')}),
            $("<div/>",{class:"card-body"}).append([
                $('<h3/>',{text:response.name}).append(
                    getIcon(response.weather)
                ),
                $('<div/>',{text:"Temperature: "+kelvToF(response.main.temp)+"°F"}),
                $('<div/>',{text:"Humidity: "+response.main.humidity+"%"}),
                $('<div/>',{text:"Wind Speed: "+response.wind.speed+" MPH"}),
                $('<div/>',{id:"uvDiv",text:"UV Index: "})
            ])
        ])
        //since the other AJAX call ran, we know that the city is valid.  run the other calls
        printWeatherForecast(cityName)
        getUV(response);
    });
}



function printWeatherForecast(cityName){
    $.ajax({
        url:dayforcastQry+cityName,
        method:"GET",
    })
    .then(function(response){
        dayForcastDiv.empty()
        //loop through all 3 hour increments returned, looking for the ones at noon
        for (chunk of response.list){
            if(chunk.dt_txt.includes("12:00:00")){
                //console.log(chunk);
                //create card
                dayForcastDiv.append( 
                    $("<div/>",{class:"card bg-primary text-center text-white border border-white p-2 col-xs-12 col-sm-6 col-md-4 col-lg"}).append([
                        $("<div/>",{class:"font-weight-bold", text:moment.unix(chunk.dt).format("MM/DD/YYYY")}),
                        $('<h3/>',{text:response.name}).append(
                            getIcon(chunk.weather)
                        ),
                        $('<div/>',{text:"Temp: "+kelvToF(chunk.main.temp)+"°F"}),
                        $('<div/>',{text:"Humidity: "+chunk.main.humidity+"%"})
                    ])
                )

            }
        }
    });
}


function cityAdded(event){
    event.preventDefault();
    // salt value passed
    newCity = cityInput.val().toLowerCase().trim();
    if (newCity ==""){return;}

    //add if not already in the list...
    if(cityHist.indexOf(newCity) < 0){
        cityHist.push(newCity)
    }
    //highlight previous if it already exists
    else{
        printWeatherForCity(newCity);
        return;
    }

    //clear the input value again;
    cityInput.val("");

    //call function.  this will pop the element if it does not exist
    printWeatherForCity(newCity);

    //print all buttons
    printButtons();
}

/*Main*/

$(window).on("load", function(){
    loadHist();
    printButtons();
});

citySearchForm.on("submit", cityAdded);

$(document).on("click",".city-btn", function(){
    city = $(this).attr("data-city");
    printWeatherForCity(city);
})


