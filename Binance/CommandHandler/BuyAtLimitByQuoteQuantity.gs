var Binance_CommandHandler_BuyAtLimitByQuoteQuantity = function(apiKey, apiSecret, fee) {
  var symbolDefinitionFetcher = new Binance_Service_SymbolDefinitionFetcher();
  var priceFetcher = new Binance_Service_PriceFetcher();
  var quantityComputer = new Binance_Service_QuantityComputer();
  var orderCreator = new Binance_Service_OrderCreator(apiKey, apiSecret);
  var priceNormalizer = new Binance_Service_PriceNormalizer();

  this.handle = function(command) {
    var symbol = command.baseAsset + command.quoteAsset;
    var definition = symbolDefinitionFetcher.fetch(symbol);
    var price = priceNormalizer.normalize(definition, command.price);
    var buyQuantity = quantityComputer.computeMaxBaseQuantityByQuoteQuantity(definition, command.quantity, command.price, fee);

    return orderCreator.createBuyLimit(symbol, buyQuantity, price);
  };
}
