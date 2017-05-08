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
import bookFile from '../fixtures/book1.json';
import file from '../fixtures/test.json';


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
      console.log(index.createIndex('book1.json', bookFile));
      expect(index.createIndex('book1.json', bookFile)).toEqual(
        { 'book1.json':
        { harry: [0, 1],
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
  });
  const index2 = new InvertedIndex();
  const index3 = new InvertedIndex();
  const firstIndex = index2.createIndex('test.json', file);
  const firsthalf = index3.createIndex('test.json', file);
  const secondHalf = index3.createIndex('book1.json', bookFile);
  const indexData = index3.filesIndexed;

  describe('Search index', () => {
    it('should return false if the search term cannot be found in the book', () => {
      expect(index2.searchIndex(firstIndex, 'test.json', 'm')).toEqual({ 'test.json': { m: false } });
    });
    // it('should ensure that the passed in index is in the correct form', () => {
    //   expect(index.searchIndex({ book: { page: ['random', 'anonymous'] } }, 'test.json', 'm')).toEqual('invalid index');
    // });
    it('should return the correct result if the search term is a single word', () => {
      expect(index2.searchIndex(firstIndex, 'test.json', 'a')).toEqual({ 'test.json': { a: [0, 1] } });
    });
    it('should return the correct result if the search term is a list of words', () => {
      expect(index2.searchIndex(firstIndex, 'test.json', 'm', 'a')).toEqual({ 'test.json': { m: false, a: [0, 1] } });
    });
    // it('should be able to handle a varying number of search arguments and return correct results', () => {
    //   expect(index.searchIndex(firstIndex, 'test.json', 'm', ['a', 'b'], 'c')).toEqual({ 'test.json': { m: false, a: [0, 1], b: [0, 1], c: [0] } });
    // });
    // it('should return a search of all the books that have been indexed if no fileName is specified', () => {
    //   expect(index.searchIndex(indexData, 'a', 'the')).toEqual(
    //     { 'test.json': { a: [0, 1], the: false } }, { 'book1.json': { a: false, the: [0, 1] }
    //     });
    // });
  });
});

// describe('Inverted index endpoints test', () => {
//   describe('Create Index endpoint', () => {
//     it('should return valid index data for /create/index...', (done) => {
//       supertest(app)
//       .post('/create/index')
//       .send('test.json')
//       .expect(200)
//       .expect(
//         { 'book1.json':
//         { harry: [0, 1],
//           porter: [0, 1],
//           the: [0, 1],
//           boy: [0],
//           who: [0],
//           was: [0],
//           destined: [0],
//           to: [0],
//           defeat: [0],
//           lord: [0],
//           voldermort: [0],
//           sorceres: [1],
//           stone: [1],
//           first: [1],
//           book: [1],
//           of: [1],
//           series: [1] } },
//         done);
//     });
//     it('should return valid index data for /create/index...', (done) => {
//       supertest(app)
//       .post('/create/index')
//       .send('book1.json')
//       .expect(200, done);
//     });
//   });

//   describe('Search Index endpoint', () => {
//     it('should return valid index data for /search/index...', (done) => {
//       supertest(app)
//       .post('/search/index')
//       .expect(200)
//       .end((err, res) => {
//         res.status.should.equal(200);
//         done();
//       });
//     });
//   });
// });
