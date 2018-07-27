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
      
      if (error.message === "Precision is over the maximum defined for this asset") {
        // {"symbol":"XRPUSDT","side":"SELL","type":"LIMIT","timeInForce":"GTC","quantity":"33.4","price":"0.44899000000000006","newOrderRespType":"FULL","timestamp":1532691483813}
      }
      
      if (error.code === -2010 && error.message === 'Account has insufficient balance for requested action.') {
        sellQuantity = quantityComputer.decreaseBaseQuantityStep(definition, sellQuantity, 1);
        return orderCreator.createSellLimit(symbol, sellQuantity);
      }
      throw error;
    }
  };
}
