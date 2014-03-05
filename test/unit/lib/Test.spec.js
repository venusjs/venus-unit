var expect   = require('expect.js'),
    Test     = require('../../../lib/Test'),
    helpers  = require('../../helpers'),
    _str    = require('underscore.string')
    fixtures = helpers.fixtures;

describe('Test', function () {
  var test;

  beforeEach(function (done) {
    test = new Test(fixtures.spec('a.spec.js').path);
    test.load().then(done);
  });

  it('should set correct `code` value', function () {
    expect(test.code.length).to.be(2);
    expect(_str.endsWith(test.code[0], 'venus-unit/test/fixtures/specs/a.spec.js')).to.be(true);
    expect(_str.endsWith(test.code[1], 'venus-unit/test/fixtures/specs/foo.js')).to.be(true);
  });

  it('should read full spec source', function (done) {
    test.source().then(function (data) {
      expect(data.length).to.be(111);
      done();
    });
  });
});
