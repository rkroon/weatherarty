/**
 * Module dependencies.
 */

var config = require('./config');
var express = require('express')
var app = express()

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

	forecast.getAtTime(latitude, longitude, new Date(), function (err, res, data) {
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
		var sweaterLevel = 0;
		
		if(lowestTemp < -30){
		sweaterLevel = 0;
		} else if(lowestTemp < 0) {
		sweaterLevel = 1;
		}
		else if(lowestTemp < 15) {
		sweaterLevel = 2;
		}
		else if(lowestTemp < 30) {

		sweaterLevel = 3;
		}
		else if(lowestTemp < 40) {
		sweaterLevel = 4;
		}
		else if(lowestTemp < 50) {
		sweaterLevel = 5;
		}
		else if(lowestTemp < 60) {
		sweaterLevel = 6;
		}

		else if(lowestTemp < 70) {
		sweaterLevel = 7;
		}
		else if(lowestTemp < 80) {
		sweaterLevel = 8;
		} else{
		sweaterLevel = 9
		}
		               



lowestTemp = lowestTemp + 30;
		lowestTemp = lowestTemp % 10;
		chanceOfRain = chanceOfRain * 10;
		chanceOfRain = chanceOfRain % 10;

		console.log("Sweater Level: ",sweaterLevel);
		console.log("RainChance: ",chanceOfRain);

		pageResult.send('index', ""+ sweaterLevel+","+ chanceOfRain);	 		 	
	});
});

var server = app.listen(80, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})
