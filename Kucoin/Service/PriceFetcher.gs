var Kucoin_Service_PriceFetcher = function() {
  var cache = CacheService.getScriptCache();

  var getPrices = function() {
    var cached = cache.get("kucoin-prices");
    if (cached != null) {
      return JSON.parse(cached);
    }

    var response = UrlFetchApp.fetch("https://api.kucoin.com/v1/open/tick");
    var json = response.getContentText();
    var content = JSON.parse(json);

    var ticker = {};
    for (var index = 0; index < content.data.length; index++) {
      var baseAsset = content.data[index].coinType;
      var quoteAsset = content.data[index].coinTypePair;
      var price = content.data[index].lastDealPrice;

      if (!ticker[baseAsset]) {
        ticker[baseAsset] = {};
      }
      ticker[baseAsset][quoteAsset] = price;
    }

    cache.put("kucoin-prices", JSON.stringify(ticker), 60); // cache for 1m
    return ticker;
  }

  this.fetch = function(baseAsset, quoteAsset) {
    var prices = getPrices();
    return prices[baseAsset][quoteAsset];
  };
};

