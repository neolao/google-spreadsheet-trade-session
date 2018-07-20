var Binance_Service_AccountBalanceFetcher = function(apiKey, apiSecret) {
  var api = new Binance_Service_ApiRequester(apiKey, apiSecret);
  var cache = CacheService.getUserCache();
  
  var getAccount = function() {
    var cacheKey = "binance-account";
    var cachedJson = cache.get(cacheKey);
    if (cachedJson != null) {
      return JSON.parse(cachedJson);
    }
    
    var account = api.requestPrivate("get", "/api/v3/account", {
      timestamp: (new Date()).getTime()
    });

    cache.put(cacheKey, JSON.stringify(account), 30 ); // cache for 30 seconds
    return account;
  };
  
  this.fetchAsset = function(asset) {
    var account = getAccount();
    var balances = account.balances;
    
    for (var i = 0; i < balances.length; i++) {
      if (balances[i].asset === asset) {
        return Number(balances[i].free) + Number(balances[i].locked);
      }
    }
    return null;
  };
};