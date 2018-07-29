var Binance_CommandHandler_SellAtMarket = function(apiKey, apiSecret, fee) {
  var symbolDefinitionFetcher = new Binance_Service_SymbolDefinitionFetcher();
  var priceFetcher = new Binance_Service_PriceFetcher();
  var quantityComputer = new Binance_Service_QuantityComputer();
  var orderCreator = new Binance_Service_OrderCreator(apiKey, apiSecret);

  this.handle = function(command) {
    var symbol = command.baseAsset + command.quoteAsset;
    var definition = symbolDefinitionFetcher.fetch(symbol);
    var lastPrice = priceFetcher.fetch(symbol);
    var sellQuantity = quantityComputer.computeMaxBaseQuantity(definition, command.quantity, lastPrice, fee);

    try {
      return orderCreator.createSellMarket(symbol, sellQuantity);
    } catch (error) {
      var message = error.message;

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
