import InvertedIndexUtils from './utils/inverted-index-utils';

export default class InvertedIndex {
  constructor() {
    this.filesIndexed = {};
  }
  createIndex(fileName, fileContent) {
    const bookTokens = InvertedIndexUtils.concatTitleAndText(fileContent);
    const uniqueContent = InvertedIndexUtils.produceUniqueTokens(bookTokens);
    const index = InvertedIndexUtils.convertTokensToIndexes(uniqueContent);
    this.filesIndexed[fileName] = index;
    return this.filesIndexed || false;
  }

  searchIndex(index, fileName = '', ...terms) {
    let result = {};
    const checkFileName = fileName || '';
    if (!checkFileName || typeof checkFileName === 'undefined') {
      const bookList = Object.keys(index);
      bookList.forEach((book) => {
        result[book] = InvertedIndexUtils.searchBook(index, book, ...terms);
      });
    } else {
      result[fileName] = InvertedIndexUtils.searchBook(index, fileName, ...terms);
    }
    return result;
  }
}
