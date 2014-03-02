module.exports = TestStore;

function TestStore(testPaths) {
  var store = this.store = {};

  testPaths.forEach(function (testPath) {
    store[testPath] = {};
  });
}
