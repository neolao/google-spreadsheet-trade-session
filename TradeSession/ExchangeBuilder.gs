var TradeSession_ExchangeBuilder = {
  build: function(exchangeName) {
    var userProperties = PropertiesService.getUserProperties();
    if (exchangeName === 'Binance') {
      var apiKey = userProperties.getProperty('binance_api_key');
      var apiSecret = userProperties.getProperty('binance_api_secret');
      return new Binance(apiKey, apiSecret);
    }

    if (exchangeName === 'Kucoin') {
      var apiKey = userProperties.getProperty('kucoin_api_key');
      var apiSecret = userProperties.getProperty('kucoin_api_secret');
      return new Kucoin(apiKey, apiSecret);
    }

    throw new Error('Unknown exchange: '+exchangeName);
  }
};
