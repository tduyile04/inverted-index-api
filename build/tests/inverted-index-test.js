'use strict';

var _expect = require('expect');

var _expect2 = _interopRequireDefault(_expect);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

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

var _book = require('../fixtures/book1.json');

var _book2 = _interopRequireDefault(_book);

var _test = require('../fixtures/test.json');

var _test2 = _interopRequireDefault(_test);

var _example = require('../fixtures/example.json');

var _example2 = _interopRequireDefault(_example);

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
    it('should return "Invalid JSON" if the file is not JSON', function () {
      (0, _expect2.default)(_invertedIndexValidation2.default.checkValidJSON(_invalid2.default)).toBe('Invalid JSON');
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
    it('should return the correct error message if the file has any syntax error', function () {
      var errorMessage = 'Empty documents are invalid';
      (0, _expect2.default)(_invertedIndexValidation2.default.hasSyntaxError(_empty2.default)).toEqual(errorMessage);
    });
  });

  describe('Populate index', function () {
    it('should return the appropriate value if an index was created', function () {
      (0, _expect2.default)(index.createIndex('book1.json', _book2.default)).toEqual({ 'book1.json': { harry: [0, 1],
          porter: [0, 1],
          the: [0, 1],
          boy: [0],
          who: [0],
          was: [0],
          destined: [0],
          to: [0],
          defeat: [0],
          lord: [0],
          voldermort: [0],
          sorceres: [1],
          stone: [1],
          first: [1],
          book: [1],
          of: [1],
          series: [1] }
      });
    });
    it('should ensure that the right index was created', function () {
      var newIndex = new _invertedIndex2.default();
      var result = {
        'example.json': {
          an: [0, 1],
          the: [0, 1],
          of: [0, 1],
          inquiry: [0],
          into: [0],
          wealth: [0],
          nations: [0],
          menace: [1],
          example: [1],
          bad: [1]
        } };
      (0, _expect2.default)(newIndex.createIndex('example.json', _example2.default)).toEqual(result);
    });
  });
  var index2 = new _invertedIndex2.default();
  var index3 = new _invertedIndex2.default();
  var index4 = new _invertedIndex2.default();
  var firstIndex = index2.createIndex('test.json', _test2.default);
  var data = index3.createIndex('book1.json', _book2.default);
  var exampleIndex = index4.createIndex('example.json', _example2.default);

  describe('Search index', function () {
    it('should return false if the search term cannot be found in the book', function () {
      (0, _expect2.default)(index2.searchIndex(firstIndex, 'test.json', 'm')).toEqual({ 'test.json': { m: 'not found' } });
    });
    it('should ensure that the passed in index is in the correct form', function () {
      var result = { 'example.json': { the: [0, 1], example: [1], term: 'not found', wealth: [0] } };
      (0, _expect2.default)(index.searchIndex(exampleIndex, 'example.json', 'the', 'example', 'term', 'wealth')).toEqual(result);
    });
    it('should return the correct result if the search term is a single word', function () {
      (0, _expect2.default)(index2.searchIndex(firstIndex, 'test.json', 'a')).toEqual({ 'test.json': { a: [0, 1] } });
    });
    it('should return the correct result if the search term is a list of words', function () {
      (0, _expect2.default)(index2.searchIndex(firstIndex, 'test.json', 'm', 'a')).toEqual({ 'test.json': { m: 'not found', a: [0, 1] } });
    });
    it('should be able to handle a varying number of search arguments and return correct results', function () {
      (0, _expect2.default)(index3.searchIndex(data, 'book1.json', 'harry porter', 'the', 'a')).toEqual({ 'book1.json': { harry: [0, 1], porter: [0, 1], the: [0, 1], a: 'not found' } });
    });
  });
});

describe('Inverted index endpoints test', function () {
  describe('Create Index endpoint', function () {
    it('should return valid index data for a single upload file', function (done) {
      (0, _supertest2.default)(_app2.default).post('/create/index').attach('books', './fixtures/book1.json').expect({ 'book1.json': { harry: [0, 1],
          porter: [0, 1],
          the: [0, 1],
          boy: [0],
          who: [0],
          was: [0],
          destined: [0],
          to: [0],
          defeat: [0],
          lord: [0],
          voldermort: [0],
          sorceres: [1],
          stone: [1],
          first: [1],
          book: [1],
          of: [1],
          series: [1] } }, done);
    });
    it('should return valid index data for multiple upload file', function (done) {
      (0, _supertest2.default)(_app2.default).post('/create/index').attach('books', './fixtures/book1.json').attach('books', './fixtures/test.json').expect({ 'book1.json': { harry: [0, 1],
          porter: [0, 1],
          the: [0, 1],
          boy: [0],
          who: [0],
          was: [0],
          destined: [0],
          to: [0],
          defeat: [0],
          lord: [0],
          voldermort: [0],
          sorceres: [1],
          stone: [1],
          first: [1],
          book: [1],
          of: [1],
          series: [1]
        },
        'test.json': { a: [0, 1],
          b: [0, 1],
          c: [0],
          d: [0],
          e: [0],
          f: [0],
          x: [0, 1],
          g: [1],
          df: [1],
          y: [1],
          z: [1]
        }
      }, done);
    });
    it('should return an index that is valid json', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/createIndex').expect('Content-Type', 'application/json', done);
    });
  });
  describe('Search Index endpoint tests', function () {
    it('should return a search result that is valid json', function (done) {
      (0, _supertest2.default)(_app2.default).post('/api/searchIndex').expect('Content-Type', 'application/json', done);
    });
    it('should return "not found" for a single search term if not present in document', function () {
      (0, _supertest2.default)(_app2.default).post('/search/index').field('search', 'm').field('fileName', 'test.json').expect({ 'test.json': { m: 'not found' } });
    });
    it('should return valid index data for multiple search terms', function () {
      (0, _supertest2.default)(_app2.default).post('/search/index').field('search', 'a the').field('fileName', '').expect({ 'book1.json': { a: 'not found', the: [0, 1] } }, { 'test.json': { a: [0, 1], the: 'not found' } });
    });
  });
});