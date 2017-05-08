'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _invertedIndex = require('../src/inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _app = require('../src/routes/app');

var _app2 = _interopRequireDefault(_app);

var _invertedIndexValidation = require('../src/utils/inverted-index-validation');

var _invertedIndexValidation2 = _interopRequireDefault(_invertedIndexValidation);

var _invertedIndexUtils = require('../src/utils/inverted-index-utils');

var _invertedIndexUtils2 = _interopRequireDefault(_invertedIndexUtils);

var _invalid = require('../fixtures/invalid.json');

var _invalid2 = _interopRequireDefault(_invalid);

var _empty = require('../fixtures/empty.json');

var _empty2 = _interopRequireDefault(_empty);

var _emptyContent = require('../fixtures/empty-content.json');

var _emptyContent2 = _interopRequireDefault(_emptyContent);

var _invalidFormat = require('../fixtures/invalid-format.json');

var _invalidFormat2 = _interopRequireDefault(_invalidFormat);

var _invalidContent = require('../fixtures/invalid-content.json');

var _invalidContent2 = _interopRequireDefault(_invalidContent);

var _test = require('../fixtures/test.json');

var _test2 = _interopRequireDefault(_test);

var _book = require('../fixtures/book1.json');

var _book2 = _interopRequireDefault(_book);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index = new _invertedIndex2.default();

describe('Inverted index test', function () {
  describe('Reading books data', function () {
    it('should return false if the file content is not a valid JSON array', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.isValidJSON(_invalid2.default)).toBe(false);
    });
    it('should return true if the file content is empty', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.isEmpty(_empty2.default)).toBe(true);
    });
    it('should return "Empty documents are invalid" if the file lacks one', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.checkEmptyError(_empty2.default)).toBe('Empty documents are invalid');
    });
    it('should return "Book title and text entry cannot be empty" if one of the text or title property is left blank', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.checkEmptyContent(_emptyContent2.default)).toBe('Book title and text entry cannot be empty');
    });
    it('should return "The book must have both title and text properties" if one of the text or title property is left blank', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.checkFormatValidity(_invalidFormat2.default)).toBe('The book must have both title and text properties');
    });
    it('should return "Only string inputs are accepted as title and text" if one of the contents of the properties is not a string', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.checkContentValidity(_invalidContent2.default)).toBe('Only string inputs are accepted as title and text');
    });
    it('should return a concat of the title and text for each book', function () {
      var result = ['a b c d e f x', 'a g b d,f x y z x'];
      (0, _expect2.default)(_invertedIndexUtils2.default.concatTitleAndText(_test2.default)).toEqual(result);
    });
  });

  describe('Populate index', function () {
    it('should return the appropriate value if an index was created', function () {
      (0, _expect2.default)(index.createIndex('test.json', _test2.default)).toEqual({ 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }
      });
    });
    it('should return false if no index was created', function () {
      (0, _expect2.default)(index.createIndex('invalid.json', _invalid2.default)).toEqual(false);
    });
  });

  var firstIndex = index.createIndex('test.json', _test2.default);
  var secondIndex = index.createIndex('book1.json', _book2.default);
  var indexData = index.filesIndexed;
  describe('Search index', function () {
    it('should return false if the search term cannot be found in the book', function () {
      (0, _expect2.default)(index.searchIndex(firstIndex, 'test.json', 'm')).toEqual({ 'test.json': { m: false } });
    });
    it('should ensure that the passed in index is in the correct form', function () {
      (0, _expect2.default)(index.searchIndex({ book: { page: ['random', 'anonymous'] } }, 'test.json', 'm')).toEqual('invalid index');
    });
    it('should return the correct result if the search term is a single word', function () {
      (0, _expect2.default)(index.searchIndex(firstIndex, 'test.json', 'a')).toEqual({ 'test.json': { a: [0, 1] } });
    });
    it('should return the correct result if the search term is a list of words', function () {
      (0, _expect2.default)(index.searchIndex(firstIndex, 'test.json', 'm', 'a')).toEqual({ 'test.json': { m: false, a: [0, 1] } });
    });
    it('should be able to handle a varying number of search arguments and return correct results', function () {
      (0, _expect2.default)(index.searchIndex(firstIndex, 'test.json', 'm', ['a', 'b'], 'c')).toEqual({ 'test.json': { m: false, a: [0, 1], b: [0, 1], c: [0] } });
    });
    it('should return a search of all the books that have been indexed if no fileName is specified', function () {
      (0, _expect2.default)(index.searchIndex(indexData, 'a', 'the')).toEqual({ 'test.json': { a: [0, 1], the: false } }, { 'book1.json': { a: false, the: [0, 1] }
      });
    });
  });
});

describe('Inverted index endpoints test', function () {
  describe('Create Index endpoint', function () {
    it('should return valid index data for /create/index...', function (done) {
      (0, _supertest2.default)(_app2.default).post('/create/index').send('test.json').expect(200).expect("{ 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }", done);
      // .end((err, res) => {
      //   res.status.should.equal(200);
      //   res.body.status.should.equal('done');
      //   done();
      // });
    });
    it('should return invalid for ...', function (done) {
      (0, _supertest2.default)(_app2.default).post('/create/index').expect(404).expect(false, done);
      // .end((err, res) => {
      //   // res.status.should.equal(404);
      //   res.body.status.should.equal('invalid');
      //   done();
      // });
    });
  });
  describe('Search Index endpoint', function () {
    it('should return valid index data for /search/index...', function (done) {
      (0, _supertest2.default)(_app2.default).post('/search/index').expect(200).end(function (err, res) {
        res.status.should.equal(200);
        done();
      });
    });
    it('should return invalid for ...', function (done) {
      (0, _supertest2.default)(_app2.default).post('/search/index').expect(404).end(function (err, res) {
        res.status.should.equal(404);
        done();
      });
    });
  });
});