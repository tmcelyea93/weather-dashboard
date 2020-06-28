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
