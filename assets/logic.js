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