var Exchange_Command_BuyAtMarketByQuoteQuantity = function(baseAsset, quoteAsset, quantity, fee) {
  this.baseAsset = baseAsset;
  this.quoteAsset = quoteAsset;
  this.quantity = Number(quantity);
  this.fee = Number(fee);
}
