var TestAnnotations = v.lib('TestAnnotations');

describe('TestAnnotations', function () {

  describe('constructor', function () {
    var instance;

    before(function () {
      var source   = v.fixture('specs', 'b.spec.js');
      var basePath = v.path('fixtures', 'specs');

      instance = new TestAnnotations(source, basePath);
    });

    it('should parse html', function () {
      var expected = [
        { path: v.path('fixtures', 'html', 'test.tl'), transforms: ['dust'] },
        { path: v.path('fixtures', 'html', 'bar.html'), transforms: [] },
        { path: v.path('fixtures', 'html', 'foo.html'), transforms: [] }
      ];

      v.assert.deepEqual(instance.html, expected);
    });

    it('should parse script', function () {
      var expected = [
        { path: v.path('fixtures', 'script', 'a.js'), transforms: ['browserify'] },
        { path: v.path('fixtures', 'script', 'd1.js'), transforms: [] },
        { path: v.path('fixtures', 'script', 'd2.js'), transforms: [] }
      ];

      v.assert.deepEqual(instance.script, expected);
    });

    it('should parse css', function () {
      var expected = [
        { path: v.path('fixtures', 'css', 'main.scss'), transforms: ['sass'] }
      ];

      v.assert.deepEqual(instance.css, expected);
    });

    it('should parse code', function () {
      var expected = [
        { path: v.path('fixtures', 'code', 'biz.js'), transforms: ['minify'] }
      ];

      v.assert.deepEqual(instance.code, expected);
    });

  });
});
