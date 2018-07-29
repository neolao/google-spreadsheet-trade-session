var Binance_QueryHandler_GetSymbolOrdersFromDate = function(apiKey, apiSecret) {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  var converter = new Binance_Service_OrderConverter();
  var cache = CacheService.getUserCache();

  this.handle = function(query) {
    var symbol = query.baseAsset + query.quoteAsset;
    var cacheKey = "binance-symbol-orders-" + symbol + "-" + query.startTime;

    var cachedJson = cache.get(cacheKey);
    if (cachedJson != null) {
      return JSON.parse(cachedJson);
    }

    var binanceOrders = api.requestPrivate("get", "/api/v3/allOrders", {
      symbol: symbol,
      startTime: query.startTime,
      timestamp: (new Date()).getTime()
    });

    var orders = [];
    for (var index = 0; index < binanceOrders.length; index++) {
      orders.push(converter.convert(binanceOrders[index]));
    }

    cache.put(cacheKey, JSON.stringify(orders), 60 * 1); // cache for 1m

    return orders;
  };
}
