/**
 * Module dependencies.
 */

var config = require('./config');
var express = require('express');
var path = require('path');
var http = require('http');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, pageResult){

	var Forecast = require('forecast.io');
	var util = require('util');

	var latitude = process.env.LATITUDE;
	var longitude = process.env.LONGITUDE;

	var forecastOptions = {
		APIKey: process.env.FORECAST_API_KEY
	};

	var forecast = new Forecast(forecastOptions);

    var currentTemperature, lowestTemp, chanceOfRain;
	var time = require('time');
	var dateTime = new time.Date();

	dateTime.setTimezone('America/New_York');
	
	console.log("Current NYC Time: " + dateTime); 
	forecast.getAtTime(latitude, longitude, ((dateTime.getTime()/1000).toFixed(0)), function (err, res, data) {
	  if (err) throw err;
		console.log('Updating WEATHER DATA');
	  	console.log('Current Temperature: ' + util.inspect(data.currently.temperature));
	  	//console.log(data.hourly.data);
		
		lowestTemp = data.hourly.data[0].apparentTemperature;
		chanceOfRain = data.hourly.data[0].precipProbability;
		

	  	for(var i = 0; i < 14; i++){
	  		apparentTemperature = data.hourly.data[i].apparentTemperature
	  		console.log("Now plus", i, "hours temp:",apparentTemperature);
	  		if(apparentTemperature < lowestTemp) {
	  			lowestTemp = apparentTemperature;
	  		}
	  		var precipProbability = data.hourly.data[i].precipProbability;
	  		console.log("Now plus", i, "hours rain:",precipProbability);
	  		if(precipProbability > chanceOfRain) {
	  			chanceOfRain = precipProbability;
	  		}
	  	}

	 	currentTemp = util.inspect(data.currently.temperature);		
	 	console.log("Lowest Temp:", lowestTemp);
		console.log("Highest Chance of Rain:", chanceOfRain);	

		pageResult.render('index', {sweaterLevel: lowestTemp , chanceOfRain: chanceOfRain});	 	
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
