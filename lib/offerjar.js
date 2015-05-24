var SITES = {
  test: 'http://new-host:3001/',
  production: 'https://app.offerjar.com/',

}

var UI_SITES = {
  test: 'http://new-host:3000/',
  production: 'https://ui.offerjar.com/'
}

var offerjar = function OfferJar(siteType) {
  //var auth = new Buffer(board + ':' + pwd).toString('base64');

  this.siteType = siteType;
}

var proto = offerjar.prototype;

// Generating token is allowed only on server side due to security considerations
if (Meteor.isServer) {

  allowEnv({
    INKOMERCE_SITE: 1,
  });
  
  proto.generateToken = function(clientId,clientSecret,callback) {
    var options = {
      params: {
        clientId: clientId,
        clientSecret: clientSecret,
        grant_type: 'client_credentials'
      }
    };
    
    if (typeof(callback)=='function') {
      return HTTP.get(this.apiUrl() + 'oauth/token', options, callback);
    } else {
      var result = HTTP.get(this.apiUrl() + 'oauth/token', options);
      return result.data;
    }
  }
}

proto.apiUrl = function() {
  return SITES[this.siteType];
}
  
proto.uiUrl = function(action) {
  return UI_SITES[this.siteType] + action;
}
 
function getSite() { return (process.env.INKOMERCE_SITE || 'production'); }

OfferJar = new offerjar(getSite()); 

