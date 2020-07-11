var satoshi = 100000000;

var DELAY_CAP = 1000;

var lastBlockHeight = 0;

/** @constructor */
function TransactionSocket() {

}

TransactionSocket.init = function() {
	// Terminate previous connection, if any
	if (TransactionSocket.connection)
		TransactionSocket.connection.close();

	if ('WebSocket' in window) {
		var connection = new ReconnectingWebSocket('wss://slanger1.sochain.com/app/e9f5cc20074501ca7395?protocol=7');
		TransactionSocket.connection = connection;

		StatusBox.reconnecting("blockchain");

		connection.onopen = function() {
			console.log('dogechain.info: Connection open!');
			StatusBox.connected("blockchain");
			var chainInfo = {
				"event":"pusher:subscribe",
				"data":{ "auth":"", "channel":"blockchain_update_doge" }
			};

			var addressMonitor = {
				"event":"pusher:subscribe",
				"data":{ "auth":"", "channel":"address_doge_" + DONATION_ADDRESS }
			};

			var ticker = {
				"event":"pusher:subscribe",
				"data":{ "auth":"", "channel":"ticker_doge_btc" }
			};

			connection.send(JSON.stringify(chainInfo));
			connection.send(JSON.stringify(addressMonitor));
			connection.send(JSON.stringify(ticker));
			//connection.send(JSON.stringify(newBlocks));
			// Display the latest transaction so the user sees something.
		};

		connection.onclose = function() {
			console.log('dogechain.info: Connection closed');
			if ($("#blockchainCheckBox").prop("checked"))
				StatusBox.reconnecting("blockchain");
			else
				StatusBox.closed("blockchain");
		};

		connection.onerror = function(error) {
			console.log('Blockchain.info: Connection Error: ' + error);
		};

		connection.onmessage = function(e) {
			var msg = JSON.parse(e.data);

			switch (msg.event) {
			case "tx_update":
				var data = JSON.parse(msg.data);
				var coins = data.value.sent_value;

				setTimeout(function() {
					new Transaction(coins);
				}, Math.random() * DELAY_CAP);
				break;
			case "block_update":
				var data = JSON.parse(msg.data);
				var blockHeight = data.value.block_no;
				var transactions = data.value.total_txs;
				var diff = data.value.mining_difficulty;
				var blockSize = data.value.size;

				lastBlockHeight = blockHeight;
				new Block(blockHeight, transactions, diff, blockSize);
				break;
			case "balance_update":
				var data = JSON.parse(msg.data);
				var coins = data.sent_value;
				new Block(coins, true);
				break;
			case "price_update":
				var data = JSON.parse(msg.data);
				$("#rate").html(parseFloat(data.value.price).toFixed(8) * 100000000);
				if (rateboxTimeout) clearTimeout(rateboxTimeout);
			}

		};
	} else {
		//WebSockets are not supported.
		console.log("No websocket support.");
		StatusBox.nosupport("blockchain");
	}
};

TransactionSocket.close = function() {
	if (TransactionSocket.connection)
		TransactionSocket.connection.close();
	StatusBox.closed("blockchain");
};
