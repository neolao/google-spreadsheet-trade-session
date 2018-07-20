var Binance_Service_OrderConverter = function() {
  this.convert = function(binanceOrder) {
    var baseQuantity = Number(binanceOrder.origQty);
    var quoteQuantity = Number(binanceOrder.cummulativeQuoteQty);
    var price = Number(binanceOrder.price);
    if (!price) {
      price = quoteQuantity / baseQuantity;
    }
    var status = binanceOrder.status;
    if (status === "PARTIALLY_FILLED") {
      status = Exchange_Order_Status_Partial;
    }
    
    return new Exchange_Order(
      binanceOrder.orderId, 
      binanceOrder.side, 
      binanceOrder.type, 
      price, 
      baseQuantity, 
      quoteQuantity, 
      status
    );
  }  
};