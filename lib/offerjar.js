var SITES = {
  test: 'http://new-host:3001/',
  production: 'https://app.inkomerce.com/',

}

var UI_SITES = {
  test: 'http://new-host:3002/',
  production: 'https://ui.offerjar.com/'
}

var offerjar = function OfferJar(site_type) {
  //var auth = new Buffer(board + ':' + pwd).toString('base64');

  this.site_type = site_type;
}

var proto = offerjar.prototype;

 
// Generating token is allowed only on server side due to security considerations
if (Meteor.isServer()) {
 
  proto.apiUrl = function() {
    return SITES[this.site_type];
  }
  
  proto.uiUrl = function(action) {
    return UI_SITES[this.site_type] + action;
  }
 
  // On the client you must use an asynchronous style to get the site
  var get_site = function () { return (process.env.INKOMERCE_SITE || 'production'); }
  
  proto.generateToken = function(client_id,client_secret,callback) {
    var options = {
      params: {
        client_id: client_id,
        client_secret: client_secret,
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

  OfferJar = new offerjar(get_site());
  
  Meteor.methods({
    get_INKOMERCE_SITE: function() {
      return get_site();
    }
  });
}

if (Meteor.isClient()) {
  // Create a reactive OfferJar object

  proto.apiUrl = function() {
    var site_type = this.site_type.get();
    return site_type ? SITES[site_type] : '';
  }
  
  proto.uiUrl = function(action) {
    var site_type = this.site_type.get();
    return site_type ? UI_SITES[site_type.get] +action : '';
  }
  
  var site_type = new ReactiveVar('');
  
  OfferJar = new offerjar(site_type);

  Meteor.call("get_INKOMERCE_SITE", function(error,result) {
    if (!error && result) {
      site_type.set(result);
    }
  });
  
}



