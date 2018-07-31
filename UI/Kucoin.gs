function updateKucoinSettings() {
  var ui = SpreadsheetApp.getUi();
  var userProperties = PropertiesService.getUserProperties();

  var response = ui.prompt('Enter your Kucoin API key', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() != ui.Button.OK) {
    return;
  }
  userProperties.setProperty('kucoin_api_key', response.getResponseText());

  response = ui.prompt('Enter your Kucoin API secret', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() != ui.Button.OK) {
    return;
  }
  userProperties.setProperty('kucoin_api_secret', response.getResponseText());

  displayBinanceSettings();
}

function displayKucoinSettings() {
  var ui = SpreadsheetApp.getUi();
  var userProperties = PropertiesService.getUserProperties();

  ui.alert(
    'Kucoin settings',
    'Key: '+userProperties.getProperty('kucoin_api_key')+"\n"+
    'Secret: '+userProperties.getProperty('kucoin_api_secret'),
    ui.ButtonSet.OK
  );
}
