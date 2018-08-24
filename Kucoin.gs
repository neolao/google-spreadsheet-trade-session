var Kucoin = function(apiKey, apiSecret) {

  this.executeCommand = function(command) {
  };

  this.executeQuery = function(query) {
    var handler;

    if (query instanceof Exchange_Query_GetPrice) {
      handler = new Kucoin_QueryHandler_GetPrice();
      return handler.handle(query);
    }

    if (query instanceof Exchange_Query_GetRefreshedOrders) {
      handler = new Kucoin_QueryHandler_GetRefreshedOrders(apiKey, apiSecret);
      return handler.handle(query);
    }
  };
};
