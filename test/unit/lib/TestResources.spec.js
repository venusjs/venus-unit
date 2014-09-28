var TestResources = v.lib('TestResources');

describe('TestResources', function () {
  var config;
  var resources;

  beforeEach(function () {
    config = {
      code: [
        { path: v.path('fixtures', 'code', 'biz.js'), transforms: [] },
        { path: v.path('fixtures', 'code', 'baz.js'), transforms: [] }
      ]
    };

    resources = new TestResources(config);
  });

  it('should load the @code resources', function (done) {
    var codes = [
      v.fixture('code', 'biz.js'),
      v.fixture('code', 'baz.js')
    ];

    resources.source('code').then(function (sources) {
      v.assert.deepEqual(sources, codes);
    }).then(done, done);
  });

});
