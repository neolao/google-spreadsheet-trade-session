var Binance_CommandHandler_BuyAtMarketByQuoteAssetQuantity = function(apiKey, apiSecret, fee) {
  var symbolDefinitionFetcher = new Binance_Service_SymbolDefinitionFetcher();
  var priceFetcher = new Binance_Service_PriceFetcher();
  var quantityComputer = new Binance_Service_QuantityComputer();
  var orderCreator = new Binance_Service_OrderCreator(apiKey, apiSecret);
  
  this.handle = function(command) {
    var symbol = command.baseAsset + command.quoteAsset;
    var definition = symbolDefinitionFetcher.fetch(symbol);
    var lastPrice = priceFetcher.fetch(symbol);
    var buyQuantity = quantityComputer.computeMaxBaseQuantityByQuoteQuantity(definition, command.quantity, lastPrice, fee);
    
    try {
      return orderCreator.createBuyMarket(symbol, buyQuantity);
    } catch (error) {
      if (error.code === -2010 && error.message === 'Account has insufficient balance for requested action.') {
        buyQuantity = quantityComputer.decreaseBaseQuantityStep(definition, buyQuantity, 1);
        return orderCreator.createBuyMarket(symbol, buyQuantity);
      }
      throw error;
    }
  };
}