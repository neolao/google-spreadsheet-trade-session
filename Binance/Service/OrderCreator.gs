var Binance_Service_OrderCreator = function(apiKey, apiSecret) {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  var converter = new Binance_Service_OrderConverter();
  
  this.createBuyMarket = function(symbol, quantity) {
    var parameters = {
      symbol: symbol,
      side: "BUY",
      type: "MARKET",
      quantity: String(quantity),
      newOrderRespType: "FULL",
      timestamp: (new Date()).getTime()
    };
    
    try {
      var binanceOrder = api.requestPrivate("post", "/api/v3/order", parameters);
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" "+JSON.stringify(parameters), error.code);
    }
  };
  
  this.createSellMarket = function(symbol, quantity) {
    var parameters = {
      symbol: symbol,
      side: "SELL",
      type: "MARKET",
      quantity: String(quantity),
      newOrderRespType: "FULL",
      timestamp: (new Date()).getTime()
    };
    
    try {
      var binanceOrder = api.requestPrivate("post", "/api/v3/order", parameters);
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" "+JSON.stringify(parameters), error.code);
    }
  };
  
  this.createSellLimit = function(symbol, quantity, price) {
    var parameters = {
      symbol: symbol,
      side: "SELL",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: String(quantity),
      price: String(price),
      newOrderRespType: "FULL",
      timestamp: (new Date()).getTime()
    };
    try {
      var binanceOrder = api.requestPrivate("post", "/api/v3/order", parameters);
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" (code "+error.code+") "+JSON.stringify(parameters), error.code);
    }
  };
};