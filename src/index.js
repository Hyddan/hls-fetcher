var WalkManifest = require('./walk-manifest');
var WriteData = require('./write-data');
var path = require('path');
var _done = false;
var _options = {
      concurrency: Infinity,
      output: path.resolve('./hls-fetcher'),
      perpetual: false,
      verbose: false
    };

var main = function (options) {
  Object.assign(_options, options);

  _options.verbose && console.log('Gathering Manifest data...');

  var resources = WalkManifest(_options.decrypt, _options.output, _options.input, options.verbose);

  promise = WriteData(_options.decrypt, _options.concurrency, resources, options.verbose).then(function () {
    !_options.perpetual && (_done = true);

    !_done && main(_options);

    _done && _options.done && _options.done();
  });
};

module.exports = main;
module.exports.destroy = function (done) {
  var _originalDone = _options.done;
  _options.done = function () {
    done && done();

    _options.done = _originalDone;

    _options.done && _options.done();
  };

  _done = true;
};