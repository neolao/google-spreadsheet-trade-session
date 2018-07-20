var Exchange_Command_CreateOrder = function(baseAsset, quoteAsset, side, type, quantity) {
  this.baseAsset = baseAsset;
  this.quoteAsset = quoteAsset;
  this.side = side;
  this.type = type;
  this.quantity = quantity;
};