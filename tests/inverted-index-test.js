const expect = require('expect');
const InvertedIndexValidation = require('../utils/inverted-index-validation.js');
const invalid = require('../fixtures/invalid.json');
const empty = require('../fixtures/empty.json');
const emptyContent = require('../fixtures/empty-content.json');
const invalidFormat = require('../fixtures/invalid-format.json');
const invalidContent = require('../fixtures/invalid-content.json');

describe('Inverted index test', () => {
  describe('Case for reading books data', () => {
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
});
