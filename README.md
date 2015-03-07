# offerjar-api
The official Meteor OfferJar API wrapper

## Instalation
```
meteor add ronenm:offerjar-api
```

## Quick Guide

### The Global resource
The global resource is available from both Client and Server

```javascript

var global = new OfferJar.Global;

// On the server you can access data synchronisly
// Reults are returned as direct call to HTTP.call
// Errors will be thrown
var categories = global.getCategories().data;

// On the client you must use asynchronous call and you must use within
// a Tracked block
Tracker.autorun(function() {
  global.getCategories(function(error,result) {
    if (!error) {
      Session.set('offerjar-categories', result.data);
    }
  })
});

Template.offerjarCategories.helpers({
  categories: function() { Session.get('offerjar-categories') };
});


```



## License
MIT
