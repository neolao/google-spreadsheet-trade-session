var Binance_Service_OrderCreator = function(apiKey, apiSecret) {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  var converter = new Binance_Service_OrderConverter();

  const normalizeNumber = function(value) {
    if (value < 1 && value > 0) {
      var normalized = Number(value).toFixed(20);
      normalized = normalized.replace(/^(0\.[0-9]+)([1-9])(0+)$/, function(m, p, q) { return p + q; });
      return normalized;
    }
    return String(value);
  };

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
      console.log({message: "Created binance BUY MARKET order "+symbol, order: binanceOrder});
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" (code "+error.fileName+") "+JSON.stringify(parameters), error.fileName);
    }
  };

  this.createBuyLimit = function(symbol, quantity, price) {
    var parameters = {
      symbol: symbol,
      side: "BUY",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: String(quantity),
      price: price,
      newOrderRespType: "FULL",
      timestamp: (new Date()).getTime()
    };

    try {
      var binanceOrder = api.requestPrivate("post", "/api/v3/order", parameters);
      console.log({message: "Created binance BUY LIMIT order "+symbol, order: binanceOrder});
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" (code "+error.fileName+") "+JSON.stringify(parameters), error.fileName);
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
      console.log({message: "Created binance SELL MARKET order "+symbol, order: binanceOrder});
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" (code "+error.fileName+") "+JSON.stringify(parameters), error.fileName);
    }
  };

  this.createSellLimit = function(symbol, quantity, price) {
    var parameters = {
      symbol: symbol,
      side: "SELL",
      type: "LIMIT",
      timeInForce: "GTC",
      quantity: String(quantity),
      price: price,
      newOrderRespType: "FULL",
      timestamp: (new Date()).getTime()
    };
    try {
      var binanceOrder = api.requestPrivate("post", "/api/v3/order", parameters);
      console.log({message: "Created binance SELL LIMIT order "+symbol, order: binanceOrder});
      return converter.convert(binanceOrder);
    } catch (error) {
      throw new Error(error.message+" (code "+error.fileName+") "+JSON.stringify(parameters), error.fileName);
    }
  };
};
