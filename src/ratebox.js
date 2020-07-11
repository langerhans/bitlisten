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

switchExchange = function(exchangeName) {
	clearTimeout(rateboxTimeout);
	currentExchange = exchangeName;
	$("#rate").html("---");

	if (exchangeName == "cryptsy") {
		$("#bitstampRate").css("color", "white");
	}

	rateboxGetRate();
};
