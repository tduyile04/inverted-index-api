import expect from 'expect';
import should from 'should';
import supertest from 'supertest';
import fs from 'fs';
import InvertedIndex from '../src/inverted-index';
import app from '../src/routes/app';
import InvertedIndexValidation from '../src/utils/inverted-index-validation';
import InvertedIndexUtils from '../src/utils/inverted-index-utils';
import invalid from '../fixtures/invalid.json';
import empty from '../fixtures/empty.json';
import emptyContent from '../fixtures/empty-content.json';
import invalidFormat from '../fixtures/invalid-format.json';
import invalidContent from '../fixtures/invalid-content.json';
import file from '../fixtures/test.json';
import bookFile from '../fixtures/book1.json';

const index = new InvertedIndex();

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
    it('should return a concat of the title and text for each book', () => {
      const result = ['a b c d e f x', 'a g b d,f x y z x'];
      expect(InvertedIndexUtils.concatTitleAndText(file)).toEqual(result);
    });
  });

  describe('Populate index', () => {
    it('should return the appropriate value if an index was created', () => {
      expect(index.createIndex('test.json', file)).toEqual(
        { 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }
        });
    });
    it('should return false if no index was created', () => {
      expect(index.createIndex('invalid.json', invalid)).toEqual(false);
    });
  });

  const firstIndex = index.createIndex('test.json', file);
  const secondIndex = index.createIndex('book1.json', bookFile);
  const indexData = index.filesIndexed;
  describe('Search index', () => {
    it('should return false if the search term cannot be found in the book', () => {
      expect(index.searchIndex(firstIndex, 'test.json', 'm')).toEqual({ 'test.json': { m: false } });
    });
    it('should ensure that the passed in index is in the correct form', () => {
      expect(index.searchIndex({ book: { page: ['random', 'anonymous'] } }, 'test.json', 'm')).toEqual('invalid index');
    });
    it('should return the correct result if the search term is a single word', () => {
      expect(index.searchIndex(firstIndex, 'test.json', 'a')).toEqual({ 'test.json': { a: [0, 1] } });
    });
    it('should return the correct result if the search term is a list of words', () => {
      expect(index.searchIndex(firstIndex, 'test.json', 'm', 'a')).toEqual({ 'test.json': { m: false, a: [0, 1] } });
    });
    it('should be able to handle a varying number of search arguments and return correct results', () => {
      expect(index.searchIndex(firstIndex, 'test.json', 'm', ['a', 'b'], 'c')).toEqual({ 'test.json': { m: false, a: [0, 1], b: [0, 1], c: [0] } });
    });
    it('should return a search of all the books that have been indexed if no fileName is specified', () => {
      expect(index.searchIndex(indexData, 'a', 'the')).toEqual(
        { 'test.json': { a: [0, 1], the: false } }, { 'book1.json': { a: false, the: [0, 1] }
        });
    });
  });
});

describe('Inverted index endpoints test', () => {
  describe('Create Index endpoint', () => {
    it('should return valid index data for /create/index...', (done) => {
      supertest(app)
      .post('/create/index')
      .send('test.json')
      .expect(200)
      .expect(
        "{ 'test.json': { a: [0, 1], b: [0, 1], c: [0], d: [0, 1], e: [0], f: [0, 1], g: [1], x: [0, 1], y: [1], z: [1] }",
        done);
      // .end((err, res) => {
      //   res.status.should.equal(200);
      //   res.body.status.should.equal('done');
      //   done();
      // });
    });
    it('should return invalid for ...', (done) => {
      supertest(app)
      .post('/create/index')
      .expect(404)
      .expect(false, done);
      // .end((err, res) => {
      //   // res.status.should.equal(404);
      //   res.body.status.should.equal('invalid');
      //   done();
      // });
    });
  });
  describe('Search Index endpoint', () => {
    it('should return valid index data for /search/index...', (done) => {
      supertest(app)
      .post('/search/index')
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        done();
      });
    });
    it('should return invalid for ...', (done) => {
      supertest(app)
      .post('/search/index')
      .expect(404)
      .end((err, res) => {
        res.status.should.equal(404);
        done();
      });
    });
  });
});
