var Connector = OfferJar.Connector;

var PartnerProxy = function(token) {
  Connector.call(this,token);
}

OfferJar.PartnerProxy = PartnerProxy;

var proto = PartnerProxy.prototype = Object.create(Connector.prototype);

proto.constructor = PartnerProxy;

proto.connect = function(uid,callback) {
  this.uid = uid;
  return this.load(callback);
}

// rec is optional
proto.load = function(rec,callback) {
  if (typeof(rec) == 'object') {
    this.partnerRecord = rec;
    if (typeof(callback) == 'function') {
      callback.call(this.false,undefined,rec);
    }
    return rec;
  } else {
    if (typeof(rec) == 'function') {
      callback = rec;
    }
    
    if (typeof(callback) == 'function') {
      var self = this;
      return this.get(undefined,function (error, result) {
        if (!error) {
          self.partnerRecord = result.data;
        }
        callback.call(this,error,result);
      });
    } else {
      var result = this.get();
      this.partnerRecord = result.data;
      return this.partnerRecord;
    }
  }
}

proto.authenticateMe = function(uid,clientId,clientSecret,add_params,callback) {
  if (typeof(callback) == 'function') {
    var self = this;
    return this.parent.generateToken(clientId,clientSecret,function(error, result) {
      var body = result.data;
      var token_rec = body.token;
      if (token_rec.error) {
        callback.call(this,new Meteor.Error('token-error',token_rec.error),result);
      } else if (!token_rec.access_token) {
        callback.call(this,error || new Meteor.Error('token-error', "Missing token"),result);
      } else {
        self.uid = uid;
        self.token = token_rec.access_token;
        self.authenticate(add_params,function(error,result) {
          var body = result.data;
          if (!body.partner) {
            if (body.error) {
              callback.call(this,new Meteor.Error('auth-error', body.error),result);
            } else {
              callback.call(this,error || new Meteor.Error('auth-error', 'Unable to authenticate Partner proxy'),result);
            }
          } else {
            self.partnerRecord = body;
            callback.call(this,error,result);
          }
        });
      }
    });  
  } else {
    result = this.parent.generateToken(clientId,clientSecret);
    var body = result.data;
    var token_rec = body.token;
    if (token_rec.error) {
      throw new Meteor.Error('token-error',token_rec.error);
    } else if (!token_rec.access_token) {
      throw new Meteor.Error('token-error', "Missing token");
    } else {
      self.uid = uid;
      self.token = token_rec.access_token;
      var result = self.authenticate(add_params);
      var body = result.data;
      if (!body.partner) {
        if (body.error) {
          throw new Meteor.Error('auth-error', body.error);
        } else {
          throw new Meteor.Error('auth-error', 'Unable to authenticate Partner proxy');
        }
      } else {
        return self.partnerRecord = body;
      }
    }
  }
}


//##################################################################################
// get: Get your partner account's details
//
//##################################################################################
    PartnerProxy.prototype.get = function(add_params, callback) {
      var params = {
         uid: this.uid
      }
      return this.apiCall('/partner_proxies/:uid', 'get', params, add_params,callback);
    }

//##################################################################################
// create_affinity: Create or get a user affiliation
//
// Hashed Parameters: (pass to the add_params hash)
//    token (Optional,String): A token number for a user that was provided by InKomerce user authentication system
//    email_address (Optional,String): An email address that can be used to identify the user
//    name (Optional,String): Used to add a descriptive user name when it does not exists (relevant only to email_address)
//
//##################################################################################
    PartnerProxy.prototype.createAffinity = function(add_params, callback) {
      var params = {
         uid: this.uid
      }
      return this.apiCall('/partner_proxies/:uid/affinities', 'post', params, add_params,callback);
    }

//##################################################################################
// delete_affinity: Cancel an affinity
//
// Parameters:
//    user_affinity_token (String): The user affinity token of the user that is going to cancel
//
//##################################################################################
    PartnerProxy.prototype.deleteAffinity = function(user_affinity_token, add_params, callback) {
      var params = {
         uid: this.uid,      user_affinity_token: user_affinity_token
      }
      return this.apiCall('/partner_proxies/:uid/affinities/:user_affinity_token', 'delete', params, add_params,callback);
    }

//##################################################################################
// expose_affinity: Expose an affinity (works only on anonymous affinities)
//
// Parameters:
//    user_affinity_token (String): The user affinity token of the user that is going to cancel
//
// Hashed Parameters: (pass to the add_params hash)
//    token (Optional,String): A token number for a user that was provided by InKomerce user authentication system
//    email_address (Optional,String): An email address that can be used to identify the user
//    name (Optional,String): Used to add a descriptive user name when it does not exists (relevant only to email_address)
//
//##################################################################################
    PartnerProxy.prototype.exposeAffinity = function(user_affinity_token, add_params, callback) {
      var params = {
         uid: this.uid,      user_affinity_token: user_affinity_token
      }
      return this.apiCall('/partner_proxies/:uid/affinities/:user_affinity_token/expose', 'post', params, add_params,callback);
    }

//##################################################################################
// get_affinity_session: Get a user session for usage of other applications. Session is valid for 10 minutes!
//
// Parameters:
//    user_affinity_token (String): The user affinity token of the user that is going to cancel
//
//##################################################################################
    PartnerProxy.prototype.getAffinitySession = function(user_affinity_token, add_params, callback) {
      var params = {
         uid: this.uid,      user_affinity_token: user_affinity_token
      }
      return this.apiCall('/partner_proxies/:uid/affinities/:user_affinity_token/session', 'get', params, add_params,callback);
    }

//##################################################################################
// authenticate: Authenticate your partner account
//
//##################################################################################
    PartnerProxy.prototype.authenticate = function(add_params, callback) {
      var params = {
         uid: this.uid
      }
      return this.apiCall('/partner_proxies/:uid/authenticate', 'post', params, add_params,callback);
    }

