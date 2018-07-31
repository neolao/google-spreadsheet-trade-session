var Kucoin_QueryHandler_GetRefreshedOrders = function(apiKey, apiSecret) {
  var api = new Kucoin_Service_ApiRequester(apiKey, apiSecret);
  var converter = new Kucoin_Service_OrderConverter();
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

  var fetchSellOrdersFromDate = function(symbol, startTime) {
    var cacheKey = "kucoin-symbol-orders-" + symbol + "-SELL-" + startTime;
    var response = api.request("get", "/api/order/active", {
      symbol: symbol,
      direction: "SELL",
      since: startTime,
    });
    var kucoinOrders = response.data.datas;

    var orders = [];
    for (var index = 0; index < kucoinOrders.length; index++) {
      orders.push(converter.convert(kucoinOrders[index]));
    }

    cache.put(cacheKey, JSON.stringify(orders), 60 * 1); // cache for 1m

    return orders;
  };

  this.handle = function(query) {
    var orders = query.orders;
    var symbol = orders[0].baseAsset + "-" + orders[0].quoteAsset;
    var startTime = getOldestStartTime(orders);

    var fetchedOrders = fetchSellOrdersFromDate(symbol, startTime);
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
}
