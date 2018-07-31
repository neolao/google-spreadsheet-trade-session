var Binance_Service_ApiRequester = function(apiKey, apiSecret) {
  var baseUrl = "https://api.binance.com";

  this.request = function(method, path, parameters) {
    var sortedParameters = [];
    for (var key in parameters) {
      sortedParameters.push({key: key, value: parameters[key]});
    }
    sortedParameters.sort(function(a, b) {
      if (a.key > b.key) {
        return 1;
      } else if (a.key < b.key) {
        return -1;
      }
      return 0;
    });

    var queryString = sortedParameters.map(function(parameter) {
      return parameter.key + "=" + parameter.value;
    }).join("&");

    var query = "?" + queryString;
    var options = {
        method: method,
        muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(baseUrl + path + query, options);
    var json = response.getContentText();
    return JSON.parse(json);
  }

  this.requestPrivate = function(method, path, parameters) {
    var sortedParameters = [];
    for (var key in parameters) {
      sortedParameters.push({key: key, value: parameters[key]});
    }
    sortedParameters.sort(function(a, b) {
      if (a.key > b.key) {
        return 1;
      } else if (a.key < b.key) {
        return -1;
      }
      return 0;
    });


    var queryString = sortedParameters.map(function(parameter) {
      return parameter.key + "=" + parameter.value;
    }).join("&");

    var signature = Utilities.computeHmacSha256Signature(queryString, apiSecret);
    signature = signature.map(function(e) {
        var v = (e < 0 ? e + 256 : e).toString(16);
        return v.length == 1 ? "0" + v : v;
    }).join("");
    var query = "?" + queryString + "&signature=" + signature;
    var options = {
        method: method,
        headers: {"X-MBX-APIKEY": apiKey},
        muteHttpExceptions: true
    };
    var response = UrlFetchApp.fetch(baseUrl + path + query, options);
    var json = response.getContentText();
    if (response.getResponseCode() >= 400) {
      //  {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
      var content = JSON.parse(json);
      console.log(json);
      throw new Error(content.msg, content.code);
    }
    return JSON.parse(json);
  }
}
