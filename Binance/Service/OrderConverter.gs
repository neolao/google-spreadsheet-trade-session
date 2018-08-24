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

    var time = (new Date()).getTime();
    if (binanceOrder.time) {
      time = binanceOrder.time;
    } else if (binanceOrder.transactTime) {
      time = binanceOrder.transactTime;
    }

    return new Exchange_Order(
      binanceOrder.orderId,
      time,
      binanceOrder.side,
      binanceOrder.type,
      price,
      baseQuantity,
      quoteQuantity,
      status
    );
  }
};
