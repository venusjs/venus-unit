var expect    = require('expect.js'),
    TestStore = require('../../../lib/TestStore');

describe('TestStore', function () {
  var store;

  beforeEach(function () {
    store = new TestStore(['foobar.js', 'barfoo.js']);
  });

  it('should create foobar.js property', function () {
    expect(typeof store.store['foobar.js']).to.be('object');
  });

  it('should create barfoo.js property', function () {
    expect(typeof store.store['barfoo.js']).to.be('object');
  });

  it('should not create any other properties', function () {
    expect(Object.keys(store.store).length).to.be(2);
  });
});
