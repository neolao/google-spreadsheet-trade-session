var Exchange_Command_BuyAtLimitByQuoteQuantity = function(baseAsset, quoteAsset, quantity, price) {
  this.baseAsset = baseAsset;
  this.quoteAsset = quoteAsset;
  this.quantity = Number(quantity);
  this.price = Number(price);
}
