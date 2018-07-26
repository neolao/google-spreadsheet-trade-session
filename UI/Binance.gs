function updateBinanceSettings() {
  var ui = SpreadsheetApp.getUi();
  var userProperties = PropertiesService.getUserProperties();
  
  var response = ui.prompt('Enter your Binance API key', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() != ui.Button.OK) {
    return;
  }
  userProperties.setProperty('binance_api_key', response.getResponseText());
  
  response = ui.prompt('Enter your Binance API secret', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() != ui.Button.OK) {
    return;
  }
  userProperties.setProperty('binance_api_secret', response.getResponseText());
    
  displayBinanceSettings();
}

function displayBinanceSettings() {
  var ui = SpreadsheetApp.getUi();
  var userProperties = PropertiesService.getUserProperties();
  
  ui.alert(
    'Binance settings', 
    'Key: '+userProperties.getProperty('binance_api_key')+"\n"+
    'Secret: '+userProperties.getProperty('binance_api_secret'),
    ui.ButtonSet.OK
  );
}