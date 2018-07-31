var Kucoin_Service_OrderConverter = function() {
  /*
     {
        "oid": "5b1a6c14264fad05239bb205",
        "userOid": null,
        "coinType": "KCS",
        "coinTypePair": "BTC",
        "direction": "SELL",
        "price": 0.000055,
        "dealAmount": 1,
        "pendingAmount": 0,
        "createdAt": "2018-06-08T19:44:21.000+0800",
        "updatedAt": null
      }
      {
        "coinType": "KCS",
        "dealValueTotal": 0.00938022,
        "dealPriceAverage": 0.0001009,
        "feeTotal": 2e-8,
        "userOid": "5969ddc96732d54312eb960e",
        "dealAmount": 0,
        "dealOrders": {
          "total": 709,
          "firstPage": true,
          "lastPage": false,
          "datas": [
            {
              "amount": 1,
              "dealValue": 0.0001009,
              "fee": 1e-8,
              "dealPrice": 0.0001009,
              "feeRate": 0
            },
            {
              "amount": 92.79323381,
              "dealValue": 0.00927932,
              "fee": 1e-8,
              "dealPrice": 0.0001,
              "feeRate": 0
            }
          ],
          "currPageNo": 1,
          "limit": 2,
          "pageNos": 355
        },
        "coinTypePair": "BTC",
        "orderPrice": 0.0001067,
        "type": "SELL",
        "orderOid": "59e41cd69bd8d374c9956c75",
        "pendingAmount": 187.34,
        "isActive": true
      }
   */
  this.convert = function(kucoinOrder) {
    console.log(kucoinOrder);
    var baseQuantity = 0;
    if (kucoinOrder.dealAmount) {
      baseQuantity = kucoin.dealAmount;
    }
    var quoteQuantity = 0;

    var price = 0;
    if (kucoinOrder.price) {
      price = kucoinOrder.price;
    }
    if (kucoinOrder.orderPrice) {
      price = kucoinOrder.orderPrice;
    }

    var type = "LIMIT";
    var status = "NEW";

    return new Exchange_Order(
      kucoinOrder.oid,
      (new Date(kucoin.createdAt)).getTime(),
      kucoinOrder.direction,
      type,
      price,
      baseQuantity,
      quoteQuantity,
      status
    );
  }
};
