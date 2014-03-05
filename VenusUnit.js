var glob = require('glob'),
    path = require('path');

module.exports = VenusUnit;

/**
 * @class VenusUnit
 * @constructor
 * @param {Venus} venus context object
 */
function VenusUnit(venus, log) {
  this.venus = venus;
  this.log   = log;

  this.bindEvents(venus);
  this.buildTests(venus);
};

/**
 * @method buildTests
 * @param {Venus} venus context object
 */
VenusUnit.prototype.buildTests = function (venus) {
  var tests = venus.config.tests,
      log   = this.log;

  if (!tests) {
    log('No tests specified in config options');
    return;
  }

  log(log.yellow(tests));
  testPaths = glob.sync(tests).map(function (file) {
    return path.resolve(process.cwd(), file);
  });

};

/**
 * @method bindEvents
 * @param {Venus} venus context object
 */
VenusUnit.prototype.bindEvents = function (venus) {
  var events = this.venus.events;

  venus.on(events.VC_START, this.onStart.bind(this));
};

/**
 * @method onStart
 */
VenusUnit.prototype.onStart = function () {
  this.log('init venus unit, running tests:', this.venus.config.tests);
  this.venus.emit('venus-http:register-namespace', 'venus-unit', this.onHttpRequest, this);
};

/**
 * @method onHttpRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
VenusUnit.prototype.onHttpRequest = function (request, response) {
  console.log('hello from VenusUnit');
  response.end('VenusUnit is in da house');
};
