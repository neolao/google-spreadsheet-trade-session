var Kucoin_QueryHandler_GetPrice = function() {
  var priceFetcher = new Kucoin_Service_PriceFetcher();

  this.handle = function(query) {
    return priceFetcher.fetch(
      query.baseAsset.toUpperCase(),
      query.quoteAsset.toUpperCase()
    );
  };
}
