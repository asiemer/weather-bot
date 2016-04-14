var token = 'your slack key here'; //slack bot api key

var Botkit = require('botkit');
var http = require('http');

var key = 'your wunderground key here'; //wunderground api key

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: token
})

bot.startRTM(function(err,bot,payload) 
{

	if (err) 
	{
	    throw new Error('Could not connect to Slack');
	}

});

controller.hears(["weather"], ["mention", "direct_mention", "direct_message"], function(bot,message){
	
	var txt = message.text;
	txt = txt.toLowerCase().replace('weather ','');
	var city = txt.split(',')[0].trim().replace(' ','_');
	var state = txt.split(',')[1].trim();

	console.log(city + ', ' + state);
	var url = '/api/' + key + '/forecast/q/state/city.json'
	url = url.replace('state', state);
	url = url.replace('city', city);

	http.get({
		host: 'api.wunderground.com',
		path: url
	}, function(response){
		var body = '';
		response.on('data',function(d){
			body += d;
		})
		response.on('end', function(){
			var data = JSON.parse(body);
			var days = data.forecast.simpleforecast.forecastday;
			for(i = 0;i<days.length;i++)
			{
				bot.reply(message, days[i].date.weekday + 
					' high: ' + days[i].high.fahrenheit + 
					' low: ' + days[i].low.fahrenheit + 
					' condition: ' + days[i].conditions);
				bot.reply(message, days[i].icon_url);
			}
		})
	})	
});
