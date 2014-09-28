'use strict';

var parse = require('venus-annotations');
var glob  = require('glob');
var _     = require('lodash');
var path  = require('path');

module.exports = TestAnnotations;

/**
 * Parse test annotations from source file
 * @constructor
 * @param {string} source Source containing annotations
 * @param {string} basePath Directory of source file
 */
function TestAnnotations(source, basePath) {
  this.basePath = basePath;
  this.parse(source);
}

/**
 * Parse annotations from source
 * @param {string} source Source containing annotations
 */
TestAnnotations.prototype.parse = function (source) {
  this.annotations = parse(source);
  this.script      = this.parseFileAnnotation('script', this.annotations);
  this.code        = this.parseFileAnnotation('code', this.annotations);
  this.html        = this.parseFileAnnotation('html', this.annotations);
  this.css         = this.parseFileAnnotation('css', this.annotations);
};

/**
 * Parse an annotation which specifies files to include in the test. A filepath
 * may be specified as an individual file, or as a glab pattern with wild card matching.
 *
 * Files may also be specified with transforms to apply, for example, browserify to bundle
 * commonJS code for the browser.
 *
 * An example annotation might be: @venus-include test*.js browserify
 * @param {string} annotationName Name of the annotation (ex, `code` or `include`)
 * @param {object} annotations Hash of annotations, parsed by venus-annotations
 */
TestAnnotations.prototype.parseFileAnnotation = function (annotationName, annotations) {
  return Object
    .keys(annotations)
    .reduce(this.reduce(annotationName, annotations), [])
    .reduce(this.reduceFileInclude.bind(this), []);
};

/**
 * Reduce file include by resolving globs
 * @param {array} values List of reduced values
 * @param {array} value Value represented as array, to reduce in to values array
 */
TestAnnotations.prototype.reduceFileInclude = function (values, value) {
  // format of include is: @venus-NAME glob_pattern transform1 transform2 ...
  // Example:
  //  @venus-code *.js browserify minify
  this
    .resolvePathAndGlobs(value[0])
    .forEach(function (filePath) {
      values.push({
        path: filePath,
        transforms: value.slice(1)
      });
    });

  return values;
};

/**
 * Reduce annotation values, ignoring case of annotation name
 * E.g., combine values for iNCLUDE and INCLUDE in to a single list
 * @param {string} annotationName
 * @param {object} annotations
 * @returns {function}
 */
TestAnnotations.prototype.reduce = function (annotationName, annotations) {
  return function (values, key) {
    if (key.toLowerCase() === annotationName.toLowerCase()) {
      values = values.concat(annotations[key]);
    }

    return values;
  };
};

/**
 * @method resolvePathAndGlobs
 * @param {string} filePath
 * @returns {array} absolute file paths
 */
TestAnnotations.prototype.resolvePathAndGlobs = function (filePath) {
  var matches = glob.sync(path.resolve(this.basePath, filePath));

  if (matches.length === 0) {
    console.error('Could not locate any matching files for pattern %s', filePath);
  }

  return matches;
};
