var Binance_QueryHandler_GetAssetBalance = function(apiKey, apiSecret) {
  this.handle = function(query) {
    var accountBalanceFetcher = new Binance_Service_AccountBalanceFetcher(apiKey, apiSecret);
    return accountBalanceFetcher.fetchAsset(query.asset);
  };
}
