var rateboxTimeout;
var currentExchange;
var ratebox_ms = 3000; // 3 second update interval

rateboxGetRate = function() {
	if (currentExchange == "cryptsy") {
		// Thanks to nyg for this trick - https://github.com/nyg/bitstamp-ticker/blob/master/bitstamp.js
		var api_url = 'https://chain.so/api/v2/get_price/DOGE/BTC';
		//var yql_url = '//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D"' + api_url + '"&format=json&callback=?';
		
        $.getJSON(api_url, function (jsonp) {
          var ticker = $.parseJSON(jsonp.data.prices[0].price);
          if (ticker) {
            $("#rate").html(Math.round(parseFloat(ticker).toFixed(8) * 100000000));
          } else {
            rateboxTimeout = setTimeout(rateboxGetRate, ratebox_ms);
          }
        });
      
	} else {
		throw "Unrecognized Exchange";
	}
};

$(document).ready(function() {
	// Bitstamp websocket API
	var pusher = new Pusher('e9f5cc20074501ca7395', { encrypted: true, disabledTransports: ['sockjs'], disableStats: true });
	var channel = pusher.subscribe('ticker_doge_btc');
	channel.bind('price_update', function(ticker) {
		f (data.type == "price" && data.value.exchange=="cryptsy")
		{
			$("#rate").html(parseFloat(ticker.value.price).toFixed(8) * 100000000);
			if (rateboxTimeout) clearTimeout(rateboxTimeout);
		}
	});
});

switchExchange = function(exchangeName) {
	clearTimeout(rateboxTimeout);
	currentExchange = exchangeName;
	$("#rate").html("---");
	
	if (exchangeName == "cryptsy") {
		$("#bitstampRate").css("color", "white");
	}
	
	rateboxGetRate();
};
