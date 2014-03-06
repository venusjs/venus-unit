var glob = require('glob'),
    path = require('path');

module.exports = VenusUnit;

/**
 * @class VenusUnit
 * @constructor
 * @param {Venus} venus context object
 */
function VenusUnit(venus) {
  this.venus = venus;
  this.info  = venus.info;
  this.debug = venus.debug;

  this.bindEvents(venus);
  this.buildTests(venus);
};

/**
 * @property name
 */
VenusUnit.prototype.name = 'venus-unit';

/**
 * @method buildTests
 * @param {Venus} venus context object
 */
VenusUnit.prototype.buildTests = function (venus) {
  var tests = venus.config.tests;

  if (!tests) {
    this.info('No tests specified in config options');
    return;
  }

  this.info(this.info.yellow(tests));
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
  this.info('init venus unit, running tests:', this.venus.config.tests);
  this.venus.emit('venus-http:register-namespace', 'venus-unit', this.onHttpRequest, this);
};

/**
 * @method onHttpRequest
 * @param {http.Request} request
 * @param {http.Response} response
 */
VenusUnit.prototype.onHttpRequest = function (request, response) {
  response.end('VenusUnit is in da house');
};
