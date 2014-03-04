var fs      = require('fs'),
    path    = require('path'),
    through = require('through'),
    glob    = require('glob'),
    _       = require('lodash'),
    when    = require('when'),
    concat  = require('concat-stream'),
    parser  = require('./annotationParser');

module.exports = Test;

function Test(testPath) {
  this.fsPath     = testPath;
  this.code       = [];
  this.includes   = [];
  this.transforms = [];
  this.basePath   = path.dirname(testPath);
}

/**
 * @property {string} fsPath
 * @default null
 */
Test.prototype.fsPath = null;

/**
 * @method load
 */
Test.prototype.load = function () {
  return this.readMetaData();
};

/**
 * @method readMetaData
 */
Test.prototype.readMetaData = function () {
  var def  = when.defer();

  this.fsStream().pipe(through(function (data) {
    this.resolve(parser.parse(data.toString()));
  }.bind(this), def.resolve));

  return def.promise;
};

/**
 * @method fsStream
 */
Test.prototype.fsStream = function () {
  return fs.createReadStream(this.fsPath);
};

/**
 * @method resolve
 * @param {object} annotations data
 */
Test.prototype.resolve = function (annotations) {
  ['code', 'include'].forEach(function (key) {
    if (annotations[key]) {
      annotations[key] = this.resolvePathsAndGlobs(annotations[key]);
    }
  }, this);

  this.code = annotations.code;
};

/**
 * @method resolvePathsAndGlobs
 * @param {array} value
 */
Test.prototype.resolvePathsAndGlobs = function (value) {
  var resolvedValues = [];

  value = value.map(function (item) {
    return path.resolve(this.basePath, item);
  }, this);

  value.forEach(function (item) {
    resolvedValues = resolvedValues.concat(glob.sync(item));
  }, this);

  return _.uniq(resolvedValues);
};

/**
 * @method transform
 */
Test.prototype.source = function () {
  var def;

  def = when.defer();

  this.fsStream().pipe(concat(function (data) {
    def.resolve(data.toString());
  }));

  return def.promise;
};

