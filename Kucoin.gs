var Kycoin = function(apiKey, apiSecret) {
  this.executeQuery = function(query) {
    var handler;

    if (query instanceof Exchange_Query_GetPrice) {
      handler = new Kucoin_QueryHandler_GetPrice();
      return handler.handle(query);
    }
  };
};
