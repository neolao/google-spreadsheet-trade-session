var Binance_CommandHandler_BuyAtMarketByQuoteQuantity = function(apiKey, apiSecret, fee) {
  var symbolDefinitionFetcher = new Binance_Service_SymbolDefinitionFetcher();
  var priceFetcher = new Binance_Service_PriceFetcher();
  var quantityComputer = new Binance_Service_QuantityComputer();
  var orderCreator = new Binance_Service_OrderCreator(apiKey, apiSecret);

  this.handle = function(command) {
    var symbol = command.baseAsset + command.quoteAsset;
    var definition = symbolDefinitionFetcher.fetch(symbol);
    var lastPrice = priceFetcher.fetch(symbol);
    var buyQuantity = quantityComputer.computeMaxBaseQuantityByQuoteQuantity(definition, command.quantity, lastPrice, fee);

    return orderCreator.createBuyMarket(symbol, buyQuantity);
  };
}
