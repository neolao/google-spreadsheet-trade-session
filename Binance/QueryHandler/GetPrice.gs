var Binance_QueryHandler_GetPrice = function() {
  var priceFetcher = new Binance_Service_PriceFetcher();
  
  this.handle = function(query) {
    var symbol = query.baseAsset.toUpperCase()+query.quoteAsset.toUpperCase();
    return priceFetcher.fetch(symbol);
  };
}
