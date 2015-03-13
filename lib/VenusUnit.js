var Router    = require('./Router');
var TestStore = require('./TestStore');

module.exports = VenusUnit;

/**
 * @constructor
 * @param {Venus} venus Context object
 */
function VenusUnit(venus) {
  this.venus  = venus;
  this.router = new Router(this);
  this.store  = new TestStore(this);
  this.config = venus.config;
}

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
  this.transforms = {};
};

/**
 * Register transform function
 * @param {string} name
 * @param {function} fn
 */
VenusUnit.prototype.registerTransform = function (name, fn) {
  if (this.transforms[name]) {
    this.venus.error('Error, cannot register transform "' + name + '". A transform with this name already exists.');
    return;
  }

  this.transforms[name] = fn;
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
  // console.log(this.store);
  // Promise.all(this.tests.map(function (test) {
    // return test.load();
  // })).then(function () {
    // this.info('init venus unit, running tests:', this.tests);
  // }.bind(this));
};
