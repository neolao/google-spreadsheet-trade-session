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
      var message = error.message;
      
      // Filter failure: PRICE_FILTER
      
      // Precision is over the maximum defined for this asset
      // {"symbol":"XRPUSDT","side":"SELL","type":"LIMIT","timeInForce":"GTC","quantity":"33.4","price":"0.44899000000000006","newOrderRespType":"FULL","timestamp":1532691483813}
      
      // Account has insufficient balance for requested action. 
      // {"symbol":"NEOUSDT","side":"SELL","type":"LIMIT","timeInForce":"GTC","quantity":"2.006","price":"34.631","newOrderRespType":"FULL","timestamp":1532717186155}
      // code: -2010
      if (error.fileName == -2010) {
        for (var retry = 0; retry < 10; retry++) {
          try {
            sellQuantity = quantityComputer.decreaseBaseQuantityStep(definition, sellQuantity, 2);
            return orderCreator.createSellLimit(symbol, sellQuantity);
          } catch (retryError) {
            message += "\n"+retryError.message;
            if (retryError.fileName != -2010) {
              throw new Error(message, retryError.filename);
            }
          }
        }
      }
      
      throw error;
    }
  };
}
