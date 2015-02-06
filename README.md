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
var categories = global.get_categories().data;

// On the client you must use asynchronous call and you must use within
// a Tracked block
Tracker.autorun(function() {
  global.get_categories(function(error,result) {
    if (!error) {
      Session.set('offerjar_categories', result.data.categories);
    }
  })
});

Template.offerjar_categories.helpers({
  getCategories: function() { Session.get('offerjar_categories') };
});


```

Further documentation will be available soon!

## License
MIT
