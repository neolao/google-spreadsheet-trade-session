var Exchange_Order_Side_Buy = "BUY";
var Exchange_Order_Side_Sell = "SELL";
var Exchange_Order_Sides = [
  Exchange_Order_Side_Buy,
  Exchange_Order_Side_Sell
];
var Exchange_Order_Status_New = "NEW";
var Exchange_Order_Status_Filled = "FILLED";
var Exchange_Order_Status_Partial = "PARTIAL";
var Exchange_Order_Status_Canceled = "CANCELED";
var Exchange_Order_Status_Rejected = "REJECTED";
var Exchange_Order_Status_Expired = "EXPIRED";
var Exchange_Order_Statuses = [
  Exchange_Order_Status_New,
  Exchange_Order_Status_Filled,
  Exchange_Order_Status_Partial,
  Exchange_Order_Status_Canceled,
  Exchange_Order_Status_Rejected,
  Exchange_Order_Status_Expired
];

var Exchange_Order = function(id, side, type, price, baseQuantity, quoteQuantity, status) {
  if (Exchange_Order_Sides.indexOf(side) === -1) {
    throw new Error('Invalid order side: "'+side+'". Accepted values: '.JSON.stringify(Exchange_Order_Sides));
  }
  if (Exchange_Order_Statuses.indexOf(status) === -1) {
    throw new Error('Invalid order status: "'+status+'". Accepted values: '.JSON.stringify(Exchange_Order_Statuses));
  }
  
  this.id = id;
  this.side = side;
  this.type = type;
  this.price = price;
  this.baseQuantity = baseQuantity;
  this.quoteQuantity = quoteQuantity;
  this.status = status;
};