function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui
    .createMenu('Trade sessions')
    .addItem('Refresh all sessions', 'refreshAll')
    .addSeparator()
    .addSubMenu(
      ui.createMenu('Settings')
        .addItem('Update Binance API key', 'updateBinanceSettings')
        .addItem('Display Binance API key', 'displayBinanceSettings')
    )
    .addToUi();
}

function buyCurrentSession() {
    var sheet = SpreadsheetApp.getActiveSheet();
    Logger.log("Active sheet: "+sheet.getName());
    
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('BUY '+sheet.getName(), ui.ButtonSet.YES_NO);
    if (response == ui.Button.YES) {
      Logger.log('The user\'s name is %s.', response.getResponseText());
    }
}

function refreshSheet(sheet) {
    Logger.log("Refresh: "+sheet.getName());
}

function refreshAll() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = spreadsheet.getSheets();
    for (var index = 0; index < sheets.length; index++) {
        var sheet = sheets[index];
        var sheetName = sheet.getName();
        if (sheetName.search(/^.* Session$/) != -1) {
            refreshSheet(sheet);
        }
    }
}