var Binance_Service_PriceFetcher = function() {
  var baseUrl = "https://api.binance.com";
  var cache = CacheService.getScriptCache();
  
  var getPrices = function() {
    var cached = cache.get("binance-prices");
    if (cached != null) {
      return JSON.parse(cached);
    }

    var response = UrlFetchApp.fetch(baseUrl + "/api/v3/ticker/price");
    var json = response.getContentText();
    var prices = JSON.parse(json);
    
    cache.put("binance-prices", json, 60); // cache for 1m
    return prices;
  }

  this.fetch = function(symbol) {
    var prices = getPrices();
    for (var i = 0; i < prices.length; i++) {
      if (prices[i].symbol === symbol) {
        return Number(prices[i].price);
      }
    }
    return 0;
  };
};
