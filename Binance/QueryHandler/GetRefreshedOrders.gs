var Binance_QueryHandler_GetRefreshedOrders = function(apiKey, apiSecret) {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  var converter = new Binance_Service_OrderConverter();
  var cache = CacheService.getUserCache();

  var getOldestStartTime = function(orders) {
    var startTime = (new Date()).getTime();
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];
      if (order.time < startTime) {
        startTime = order.time;
      }
    }

    return startTime;
  };

  var fetchOrdersFromDate = function(symbol, startTime) {
    var cacheKey = "binance-symbol-orders-" + symbol + "-" + startTime;
    var cachedJson = cache.get(cacheKey);
    if (cachedJson != null) {
      return JSON.parse(cachedJson);
    }

    var binanceOrders = api.requestPrivate("get", "/api/v3/allOrders", {
      symbol: symbol,
      startTime: startTime,
      timestamp: (new Date()).getTime()
    });

    var orders = [];
    for (var index = 0; index < binanceOrders.length; index++) {
      orders.push(converter.convert(binanceOrders[index]));
    }

    cache.put(cacheKey, JSON.stringify(orders), 60 * 1); // cache for 1m

    return orders;

  };

  this.handle = function(query) {
    var orders = query.orders;
    var symbol = query.baseAsset + query.quoteAsset;
    var startTime = getOldestStartTime(orders);

    var fetchedOrders = fetchOrdersFromDate(symbol, startTime);
    var refreshedOrders = [];
    for (var index = 0; index < orders.length; index++) {
      var order = orders[index];
      var refreshedOrder = order;
      for (var fetchedIndex = 0; fetchedIndex < fetchedOrders.length; fetchedIndex++) {
        var fetchedOrder = fetchedOrders[index];

        if (fetchedOrder.id == order.id) {
          refreshedOrder = fetchedOrder;
          break;
        }
      }
      refreshedOrders.push(refreshedOrder);
    }

    return refreshedOrders;
  };

};
