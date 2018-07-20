var Binance_CommandHandler_CancelOrder = function() {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  
  this.handle = function(command) {
    var symbol = command.baseAsset + command.quoteAsset;
    var parameters = {
      symbol: symbol,
      orderId: command.orderId,
      timestamp: (new Date()).getTime()
    };
    
    try {
      api.requestPrivate("delete", "/api/v3/order", parameters);
    } catch (error) {
      throw new Error(error.message+" "+JSON.stringify(parameters), error.code);
    }
  };
};