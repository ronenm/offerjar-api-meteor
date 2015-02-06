Package.describe({
  name: 'ronenm:offerjar-api',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Access the InKomerce/OfferJar API from meteor',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/ronenm/offerjar-api-meteor.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.1');
  api.use('reactive-var','client');
  api.use('underscore');
  
  // connector.js  conversation_proxy.js  global.js  offerjar.js  partner_proxy.js  store.js
  var base_files = ['offerjar.js', 'connector.js', 'global.js'];
  var server_files = ['conversation_proxy.js', 'partner_proxy.js', 'store.js'];
  
  for(var idx = 0; idx < base_files.length; idx++) {
    api.add_files("lib/" + base_files[idx]);
  }
  
  for(var idx = 0; idx < server_files.length; idx++) {
    api.add_files("lib/" + server_files[idx], 'server');
  }
  
  api.export('OfferJar');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ronenm:offerjar-api');
  api.addFiles('ronenm:offerjar-api-tests.js');
});
