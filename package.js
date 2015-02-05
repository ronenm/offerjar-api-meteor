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
  api.addFiles('ronenm:offerjar-api.js');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('ronenm:offerjar-api');
  api.addFiles('ronenm:offerjar-api-tests.js');
});
