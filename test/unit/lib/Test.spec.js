var Test = v.lib('Test');

describe('Test', function () {
  var test;

  beforeEach(function (done) {
    test = new Test(v.path('fixtures', 'specs', 'b.spec.js'));
    test.load().then(function () { done(); });
  });

  it('should set correct `code` value', function () {
    v.assert.equal(test.config.code.length, 1);
    v.assert.equal(test.config.code[0].path, v.path('fixtures', 'code', 'biz.js'));
  });

  it('should read full spec source', function (done) {
    var len = v.fixture('specs', 'b.spec.js').length;

    test.source().then(function (data) {
      v.assert.equal(data.length, len);
    }).then(done, done);
  });

  it('should return all data needed to render a test', function (done) {
    test.ctx().then(function (ctx) {
      console.log(ctx);
    }).then(done, done);
  });
});
