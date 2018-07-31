var Kucoin_Service_ApiRequester = function(apiKey, apiSecret) {
  var host = "https://api.kucoin.com";

  var buildQueryStringFromParameters = function(parameters) {
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

    return queryString;
  };

  this.request = function(method, endpoint, parameters) {
    var endpoint = "/v1/account/"+asset+"/balance";
    var queryString = buildQueryStringFromParameters(parameters);
    var nonce = Number(new Date().getTime()).toFixed(0);
    var strForSign = endpoint + "/" + nonce + "/" + queryString;
    var signatureStr = Utilities.base64Encode(strForSign, Utilities.Charset.UTF_8);
    var signature = Utilities.computeHmacSha256Signature(signatureStr, apiSecret);
    var signatureHexa = signature.reduce(function(str,chr){
      chr = (chr < 0 ? chr + 256 : chr).toString(16);
      return str + (chr.length==1?'0':'') + chr;
    },'');

    var options = {
      headers: {
        "KC-API-KEY": apiKey,
        "KC-API-NONCE": nonce,
        "KC-API-SIGNATURE": signatureHexa
      }
    };
    var response = UrlFetchApp.fetch(host + endpoint, options);
    var json = response.getContentText();
    return JSON.parse(json);
  }
};
