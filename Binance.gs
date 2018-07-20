var Binance = function(apiKey, apiSecret) {
  var fee = 0.001;
  
  this.executeCommand = function(command) {
    var handler;
    
    if (command instanceof Exchange_Command_BuyAtMarketByQuoteAssetQuantity) {
      handler = new Binance_CommandHandler_BuyAtMarketByQuoteAssetQuantity(apiKey, apiSecret, fee);
      return handler.handle(command);
    }
    
    if (command instanceof Exchange_Command_SellAtLimit) {
      handler = new Binance_CommandHandler_SellAtLimit(apiKey, apiSecret, fee);
      return handler.handle(command);
    }
    
    if (command instanceof Exchange_Command_CancelOrder) {
      handler = new Binance_CommandHandler_CancelOrder(apiKey, apiSecret);
      return handler.handle(command);
    }
  };
  
  this.executeQuery = function(query) {
    var handler;
    
    if (query instanceof Exchange_Query_GetAssetBalance) {
      handler = new Binance_QueryHandler_GetAssetBalance(apiKey, apiSecret);
      return handler.handle(query);
    }
    
    if (query instanceof Exchange_Query_GetOrder) {
      handler = new Binance_QueryHandler_GetOrder(apiKey, apiSecret);
      return handler.handle(query);
    }
  };
}

