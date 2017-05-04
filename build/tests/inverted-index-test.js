'use strict';

var expect = require('expect');
var should = require('should');
var supertest = require('supertest');
var InvertedIndex = require('../src/inverted-index.js');
var app = require('../src/routes/app');
var InvertedIndexValidation = require('../src/utils/inverted-index-validation.js');
var invalid = require('../fixtures/invalid.json');
var empty = require('../fixtures/empty.json');
var emptyContent = require('../fixtures/empty-content.json');
var invalidFormat = require('../fixtures/invalid-format.json');
var invalidContent = require('../fixtures/invalid-content.json');
var file = require('../fixtures/test.json');
var bookFile = require('../fixtures/test.json');

describe('Inverted index test', function () {
  describe('Reading books data', function () {
    it('should return false if the file content is not a valid JSON array', function () {
      expect(InvertedIndexValidation.isValidJSON(invalid)).toBe(false);
    });
    it('should return true if the file content is empty', function () {
      expect(InvertedIndexValidation.isEmpty(empty)).toBe(true);
    });
    it('should return "Empty documents are invalid" if the file lacks one', function () {
      expect(InvertedIndexValidation.checkEmptyError(empty)).toBe('Empty documents are invalid');
    });
    it('should return "Book title and text entry cannot be empty" if one of the text or title property is left blank', function () {
      expect(InvertedIndexValidation.checkEmptyContent(emptyContent)).toBe('Book title and text entry cannot be empty');
    });
    it('should return "The book must have both title and text properties" if one of the text or title property is left blank', function () {
      expect(InvertedIndexValidation.checkFormatValidity(invalidFormat)).toBe('The book must have both title and text properties');
    });
    it('should return "Only string inputs are accepted as title and text" if one of the contents of the properties is not a string', function () {
      expect(InvertedIndexValidation.checkContentValidity(invalidContent)).toBe('Only string inputs are accepted as title and text');
    });
  });

  var index = void 0;
  beforeEach(function () {
    index = new InvertedIndex();
  });
  describe('Populate index', function () {
    it('should return the appropriate value if an index was created', function () {
      expect(index.createIndex('test.json', file)).toBe({ 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }
      });
    });
    it('should return false if no index was created', function () {
      expect(index.createIndex('invalid.json', invalid)).toBe(false);
    });
  });

  var createdIndex = index.createIndex('test.json', file);
  var multipleIndex = index.createIndex('book1.json', bookFile);
  describe('Search index', function () {
    it('should return false if the search term cannot be found in the book', function () {
      expect(index.searchIndex(createdIndex, 'test.json', 'm')).toBe({ 'test.json': { m: false } });
    });
    it('should ensure that the passed in index is in the correct form', function () {
      expect(index.searchIndex({ book: { page: ['random', 'anonymous'] } }, 'test.json', 'm')).toBe('invalid index');
    });
    it('should return the correct result if the search term is a single word', function () {
      expect(index.searchIndex(createdIndex, 'test.json', 'a')).toBe({ 'test.json': { a: [0, 1] } });
    });
    it('should return the correct result if the search term is a list of words', function () {
      expect(index.searchIndex(createdIndex, 'test.json', 'm', 'a')).toBe({ 'test.json': { m: false, a: [0, 1] } });
    });
    it('should be able to handle a varying number of search arguments and return correct results', function () {
      expect(index.searchIndex(createdIndex, 'test.json', 'm', ['a', 'b'], 'c')).toBe({ 'test.json': { m: false, a: [0, 1], b: [0, 1], c: [0] } });
    });
    it('should return a search of all the books that have been indexed if no fileName is specified', function () {
      expect(index.searchIndex(multipleIndex, 'a', 'the')).toBe({ 'test.json': { a: [0, 1], the: false } }, { 'book1.json': { a: false, the: [0, 1] }
      });
    });
  });
});

describe('Inverted index endpoints test', function () {
  describe('Create Index endpoint', function () {
    it('should return valid index data for /create/index...', function (done) {
      supertest(app).post('/create/index').send('test.json').expect(200).expect("{ 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }", done);
      // .end((err, res) => {
      //   res.status.should.equal(200);
      //   res.body.status.should.equal('done');
      //   done();
      // });
    });
    it('should return invalid for ...', function (done) {
      supertest(app).post('/create/index').expect(404).expect(false, done);
      // .end((err, res) => {
      //   // res.status.should.equal(404);
      //   res.body.status.should.equal('invalid');
      //   done();
      // });
    });
  });
  describe('Search Index endpoint', function () {
    it('should return valid index data for /search/index...', function (done) {
      supertest(app).post('/search/index').expect(200).end(function (err, res) {
        res.status.should.equal(200);
        done();
      });
    });
    it('should return invalid for ...', function (done) {
      supertest(app).post('/search/index').expect(404).end(function (err, res) {
        res.status.should.equal(404);
        done();
      });
    });
  });
});