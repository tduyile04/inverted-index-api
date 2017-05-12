import InvertedIndexUtils from './utils/inverted-index-utils';

/**
 * Creates index for files and search for words in files already indexed
 * @export
 * @class InvertedIndex
 */
export default class InvertedIndex {
  /**
   * Creates an instance of InvertedIndex.
   * Initializes a fileIndexed object that stores created index
   * @memberOf InvertedIndex
   */
  constructor() {
    this.filesIndexed = {};
  }
  /**
   * Creates index for files
   * @param {any} fileName - The name of the file to be indexed
   * @param {any} fileContent - The content of the file to be indexed
   * @returns {Object} - The map of the files indexed to its unique tokens
   * @memberOf InvertedIndex
   */
  createIndex(fileName, fileContent) {
    const bookTokens = InvertedIndexUtils.concatTitleAndText(fileContent);
    const uniqueContent = InvertedIndexUtils.produceUniqueTokens(bookTokens);
    const index = InvertedIndexUtils.convertTokensToIndexes(uniqueContent);
    this.filesIndexed[fileName] = index;
    return this.filesIndexed;
  }

  /**
   * @param {any} index - A map of the unique tokens to its corresponding index
   * @param {string} fileName - The name of the file(s) to be indexed
   * @param {any} terms - The required value(s) to be searched
   * @returns {Object} -  A map of the searched book to its index if found and
   *                     'not found' if not present in the file
   * @memberOf InvertedIndex
   */
  searchIndex(index, fileName, ...terms) {
    this.result = {};
    const fileTitleExt = /[.json]/;
    const fileNameCheck = arguments[1].match(fileTitleExt);
    if (fileNameCheck) {
      this.result[fileName] = InvertedIndexUtils.searchBook(index, fileName, ...terms);
    }
    if (!fileNameCheck) {
      const bookList = Object.keys(index);
      bookList.forEach((book) => {
        this.result[book] = InvertedIndexUtils.searchBook(index, book, ...terms);
      });
    }
    return this.result;
  }
}
