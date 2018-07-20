var Exchange_Order_Status_New = "NEW";
var Exchange_Order_Status_Filled = "FILLED";
var Exchange_Order_Status_Partial = "PARTIAL";
var Exchange_Order_Status_Canceled = "CANCELED";
var Exchange_Order = function(id, side, type, price, baseQuantity, quoteQuantity, status) {
  this.id = id;
  this.side = side;
  this.type = type;
  this.price = price;
  this.baseQuantity = baseQuantity;
  this.quoteQuantity = quoteQuantity;
  this.status = status;
};