var Binance_CommandHandler_SellAtLimit = function(apiKey, apiSecret, fee) {
  var symbolDefinitionFetcher = new Binance_Service_SymbolDefinitionFetcher();
  var quantityComputer = new Binance_Service_QuantityComputer();
  var priceNormalizer = new Binance_Service_PriceNormalizer();
  var orderCreator = new Binance_Service_OrderCreator(apiKey, apiSecret);
  
  this.handle = function(command) {
    var symbol = command.baseAsset + command.quoteAsset;
    var definition = symbolDefinitionFetcher.fetch(symbol);
    var sellPrice = priceNormalizer.normalize(definition, command.price);
    var sellQuantity = quantityComputer.computeMaxBaseQuantity(definition, command.baseQuantity, sellPrice);    
    
    try {
      return orderCreator.createSellLimit(symbol, sellQuantity, sellPrice);
    } catch (error) {
      if (error.message === "Filter failure: PRICE_FILTER") {
        throw new Error(error.message+" (code "+error.code+"), definition: "+JSON.stringify(definition)+", command price: "+command.price);
      }
      
      if (error.code === -2010 && error.message === 'Account has insufficient balance for requested action.') {
        sellQuantity = quantityComputer.decreaseBaseQuantityStep(definition, sellQuantity, 1);
        return orderCreator.createSellLimit(symbol, sellQuantity);
      }
      throw error;
    }
  };
}
