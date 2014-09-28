var Router    = require('./lib/Router');
var TestStore = require('./lib/TestStore');

module.exports = VenusUnit;

/**
 * @constructor
 * @param {Venus} venus Context object
 */
function VenusUnit(venus) {
  this.venus  = venus;
  this.router = new Router(venus, this);
  this.store  = new TestStore(this);
};

/**
 * @property name
 */
VenusUnit.prototype.name = 'venus-unit';

/**
 * Initialize
 */
VenusUnit.prototype.init = function () {
  var testData = this.venus.config.getWithMeta('tests');
  var tests    = testData.value;
  var cwd      = testData.meta.dir || process.cwd();

  this.store.init(tests, cwd);
};

/**
 * Attach
 */
VenusUnit.prototype.attach = function () {
  this.venus.plugins['venus-http'].addNamespaceHandler('venus-unit', this.router.onHttpRequest, this.router);
};


/**
 * @method onStart
 */
VenusUnit.prototype.run = function () {
  console.log(this.store);
  // Promise.all(this.tests.map(function (test) {
    // return test.load();
  // })).then(function () {
    // this.info('init venus unit, running tests:', this.tests);
  // }.bind(this));
};

