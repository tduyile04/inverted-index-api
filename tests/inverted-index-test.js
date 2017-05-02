'use strict';

const expect = require('expect');
const InvertedIndex = require('../src/inverted-index.js');
const InvertedIndexValidation = require('../utils/inverted-index-validation.js');
const invalid = require('../fixtures/invalid.json');
const empty = require('../fixtures/empty.json');
const emptyContent = require('../fixtures/empty-content.json');
const invalidFormat = require('../fixtures/invalid-format.json');
const invalidContent = require('../fixtures/invalid-content.json');
const file = require('../fixtures/test.json');
const bookFile = require('../fixtures/test.json');

describe('Inverted index test', () => {
  describe('Reading books data', () => {
    it('should return false if the file content is not a valid JSON array', () => {
      expect(InvertedIndexValidation.isValidJSON(invalid)).toBe(false);
    });
    it('should return true if the file content is empty', () => {
      expect(InvertedIndexValidation.isEmpty(empty)).toBe(true);
    });
    it('should return "Empty documents are invalid" if the file lacks one', () => {
      expect(InvertedIndexValidation.checkEmptyError(empty)).toBe('Empty documents are invalid');
    });
    it('should return "Book title and text entry cannot be empty" if one of the text or title property is left blank', () => {
      expect(InvertedIndexValidation.checkEmptyContent(emptyContent)).toBe('Book title and text entry cannot be empty');
    });
    it('should return "The book must have both title and text properties" if one of the text or title property is left blank', () => {
      expect(InvertedIndexValidation.checkFormatValidity(invalidFormat)).toBe('The book must have both title and text properties');
    });
    it('should return "Only string inputs are accepted as title and text" if one of the contents of the properties is not a string', () => {
      expect(InvertedIndexValidation.checkContentValidity(invalidContent)).toBe('Only string inputs are accepted as title and text');
    });
  });

  let index;
  beforeEach(() => {
    index = new InvertedIndex();
  });
  describe('Populate index', () => {
    it('should return the appropriate value if an index was created', () => {
      expect(index.createIndex('test.json', file)).toBe(
        { 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }
        });
    });
    it('should return false if no index was created', () => {
      expect(index.createIndex('invalid.json', invalid)).toBe(false);
    });
  });

  const createdIndex = index.createIndex('test.json', file);
  const multipleIndex = index.createIndex('book1.json', bookFile);
  describe('Search index', () => {
    it('should return false if the search term cannot be found in the book', () => {
      expect(index.searchIndex(createdIndex, 'test.json', 'm')).toBe({ 'test.json': { m: false } });
    });
    it('should ensure that the passed in index is in the correct form', () => {
      expect(index.searchIndex({ book: { page: ['random', 'anonymous'] } }, 'test.json', 'm')).toBe('invalid index');
    });
    it('should return the correct result if the search term is a single word', () => {
      expect(index.searchIndex(createdIndex, 'test.json', 'a')).toBe({ 'test.json': { a: [0, 1] } });
    });
    it('should return the correct result if the search term is a list of words', () => {
      expect(index.searchIndex(createdIndex, 'test.json', 'm', 'a')).toBe({ 'test.json': { m: false, a: [0, 1] } });
    });
    it('should be able to handle a varying number of search arguments and return correct results', () => {
      expect(index.searchIndex(createdIndex, 'test.json', 'm', ['a', 'b'], 'c')).toBe({ 'test.json': { m: false, a: [0, 1], b: [0, 1], c: [0] } });
    });
    it('should return a search of all the books that have been indexed if no fileName is specified', () => {
      expect(index.searchIndex(multipleIndex, 'a', 'the')).toBe(
        { 'test.json': { a: [0, 1], the: false } }, { 'book1.json': { a: false, the: [0, 1] }
        });
    });
  });
});
