var expect   = require('expect.js'),
    parser   = require('../../../lib/annotationParser'),
    helpers  = require('../../helpers'),
    fixtures = helpers.fixtures;

describe('annotationParser', function () {

  describe('parse', function () {
    var result;

    before(function () {
      result = parser.parse(fixtures.spec('a.spec.js').data);
    });

    it('should have the correct `code` values', function () {
      expect(result.code).to.eql(['./**/*.js', 'foo.js']);
    });

    it('should have the correct `include` values', function () {
      expect(result.include).to.eql(['bar.js']);
    });

    it('should have the correct `include-group` values', function () {
      expect(result.includeGroup).to.eql(['normal']);
    });
  });

  describe('camel', function () {
    it('should work on hyphenated string', function () {
      var result = parser.camel('hello-there');

      expect(result).to.be('helloThere');
    });

    it('not modify a camel cased string', function () {
      var result = parser.camel('helloThere');
      expect(result).to.be('helloThere');
    });

  });
});
