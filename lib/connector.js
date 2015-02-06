
// Parent should have an apiUrl method!
var Connector = function (token) {
  this.parent = OfferJar;
  this.token = token;
}

OfferJar.Connector = Connector;

Connector.prototype.apiCallUrl = function(call) {
  var api_url = this.parent.apiUrl();
  return api_url ? api_url + 'api/v1' + call : '';
}

// Method call can be called with the following possibilities:
//   connector.raw_call("call",[callback])  (uses get)
//   connector.raw_call("call",{params},[callback])  (still uses get)
//   connector.raw_call("call","method",[callback]) (uses method "method")
//   connector.raw_call("call","method",{params},[callback]) (uses method "method")
Connector.prototype.raw_call = function(call,method,params,callback) {
  // Use a "waterfall" style programming
  if (typeof(method) != 'string') {
    callback = params;
    params = method;
    method = 'GET';
  } else {
    method = method.toUpperCase();
  }
  
  if (typeof(params) == 'function') {
    callback = params;
    params = undefined;
  }
  
  var url = this.apiCallUrl(call);
  
  // On the client the url is based on a reactive variable so the code will be run again
  // when the url is available
  if (!url) {
    return undefined;
  }
  
  var req_options = {
    headers: {
      'User-Agent': 'InKomerce API Ruby SDK'
    }
    
  }
  
  if (this.token) {
    //req_options.auth = { bearer: "token=" + this.token }
    req_options.headers['Authorization'] = "Bearer token=" + this.token;
  }
  
  if (typeof(params)=='object') {
    if ((method=='GET')||(method=='DELETE')) {
      req_options.params = params;
    } else {
      // It should be either put, post and patch
      req_options.data = params;
    }
  }
  console.log("Request:" + url + ' ('+ method +')'); console.info(req_options);
  return HTTP.call(method,url,req_options,callback);
}

// Similarly you can ommit the method here, however you can't ommit params if you
// would like to use add_params (use empty hash instead!)
Connector.prototype.api_call = function(path,method,params,add_params,callback) {
  // Use a "waterfall" style programming
  if (typeof(method) != 'string') {
    callback = add_params;
    add_params = params;
    params = method;
    method = 'GET'; 
  }
  if (typeof(params) == 'function') {
    callback = params;
    params = undefined;
    add_params = undefined;
  }
  if (typeof(add_params) == 'function') {
    callback = add_params;
    add_params = undefined;
  }
  
  if (typeof(params)=='object') {
    for (p in params) {
      path = path.replace(eval("/:" + p + '(?=\\/|$)/'),params[p])
    }
  }
  
  if (typeof(add_params)=='object') {
    for (p in params) {
      path = path.replace(eval("/:" + p + '(?=\\/|$)/'),add_params[p])
    }
  }
  
  return this.raw_call(path,method,add_params,callback);
  
}



