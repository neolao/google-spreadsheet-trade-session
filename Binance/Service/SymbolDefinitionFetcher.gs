var Binance_Service_SymbolDefinitionFetcher = function() {
  var baseUrl = "https://api.binance.com";
  var cache = CacheService.getScriptCache();
  
  var getSymbols = function() {
    var response = UrlFetchApp.fetch(baseUrl + "/api/v1/exchangeInfo");
    var json = response.getContentText();
    var info = JSON.parse(json);

    return info.symbols;
  };
  
  this.fetch = function(symbol) {
    var cacheKey = "binance-sypmbol-"+symbol;
    var cachedJson = cache.get(cacheKey);
    if (cachedJson != null) {
      return JSON.parse(cachedJson);
    }
    
    var symbols = getSymbols();
    for (var index = 0; index < symbols.length; index++) {
      if (symbols[index].symbol === symbol) {
        cache.put(cacheKey, JSON.stringify(symbols[index]), 21600 ); // cache for 6h
        return symbols[index];
      }
    }
    return null;
  };
}
