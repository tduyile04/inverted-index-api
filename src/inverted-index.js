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

  searchIndex(index, fileName = 'all', ...terms) {
    let result = {};
    if (fileName !== 'all') {
      result[fileName] = InvertedIndexUtils.searchBook(index, fileName, ...terms);
    } else {
      const bookList = Object.keys(index);
      bookList.forEach((book) => {
        result[fileName] = InvertedIndexUtils.searchBook(index, book, ...terms);
      });
    }
    return result;
  }
}
