var Binance_QueryHandler_GetOrder = function(apiKey, apiSecret) {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  var converter = new Binance_Service_OrderConverter();
  var cache = CacheService.getUserCache();
    
  this.handle = function(query) {
    var orderId = query.orderId;
    var symbol = query.baseAsset + query.quoteAsset;
    var cacheKey = "binance-order-" + orderId;
    
    var cachedJson = cache.get(cacheKey);
    if (cachedJson != null) {
      return JSON.parse(cachedJson);
    }

    // {
    //   symbol=NEOUSDT, 
    //   cummulativeQuoteQty=54.16891800, 
    //   side=SELL, 
    //   executedQty=1.54200000, 
    //   orderId=42516104, 
    //   origQty=1.54200000, 
    //   clientOrderId=and_1ed3b9a228ca41778a191b1cc09f5c08, 
    //   updateTime=1.532189009725E12, 
    //   type=LIMIT, 
    //   icebergQty=0.00000000, 
    //   stopPrice=0.00000000, 
    //   price=35.12900000, 
    //   time=1.532188211336E12, 
    //   timeInForce=GTC, 
    //   isWorking=true, 
    //   status=FILLED
    // }
    var binanceOrder = api.requestPrivate("get", "/api/v3/order", {
      symbol: symbol,
      orderId: orderId,
      timestamp: (new Date()).getTime()
    });
    var order = converter.convert(binanceOrder);
  
    if (order.status === "FILLED") {
      cache.put(cacheKey, JSON.stringify(order), 21600); // cache for 6h
    } else {
      cache.put(cacheKey, JSON.stringify(order), 60); // cache for 1m
    }
    
    return order;
  };
}
