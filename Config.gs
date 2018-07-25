function getConfig() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("Config");
  var range = sheet.getRange("A:B");
  var config = range.getValues();

  var result = {};
  for (var i = 0; i < config.length; i++) {
    var property = config[i];
    result[property[0]] = property[1];
  }

  return result;
}