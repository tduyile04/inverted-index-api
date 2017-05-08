/**
 * 
 * 
 * @class InvertedIndexUtils
 */
export default class InvertedIndexUtils {

  static removeDuplicates(arr) {
    let check = {};
    let result = [];
    arr.forEach((item) => {
      if (!check[item]) {
        check[item] = true;
        result.push(item);
      }
    });
    return result;
  }

  static sanitizeInput(input) {
    input = input.toLowerCase()
    .replace(/-/g, ' ')
    .replace(/[^A-z\s]/g, '')
    .split(' ');
    let result = [];
    input.forEach((word) => {
      if (word.trim() !== '') {
        result.push(word);
      }
    });
    result = InvertedIndexUtils.removeDuplicates(result);
    return result;
  }

  static concatTitleAndText(books) {
    const space = ' ';
    const addContents = books.map((book) => {
      const str = book.title.concat(space + book.text);
      return str;
    });
    return addContents;
  }

  static produceUniqueTokens(bookArray) {
    const result = [];
    bookArray.forEach((book) => {
      const temp = InvertedIndexUtils.sanitizeInput(book);
      result.push([...temp]);
    });
    return result;
  }

  static convertTokensToIndexes(terms) {
    let result = {};
    let check = {};

    terms.forEach((term, index) => {
      term.forEach((member) => {
        if (!check[member]) {
          result[member] = [index];
          check[member] = true;
        } else {
          result[member].push(index);
        }
      });
    });
    return result;
  }

  static findSearchItem(index, fileName, item) {
    let result = {};
    if (InvertedIndexUtils.contains(item, index[fileName])) {
      result = index[fileName][item];
    } else {
      result = false;
    }
    return result;
  }

  static searchBook(index, fileName, ...terms) {
    let searchResult = {};
    if (terms.length === 1) {
      const firstElement = terms[0];
      searchResult[firstElement] = InvertedIndexUtils.findSearchItem(index, fileName, firstElement);
    } else {
      terms.forEach((element) => {
        if (typeof element === 'string') {
          searchResult[element] = InvertedIndexUtils.findSearchItem(index, fileName, element);
        }
        if (element.constructor === Array) {
          element.forEach((singleton) => {
            if (typeof element === 'string') {
              searchResult[singleton] = InvertedIndexUtils
                                       .findSearchItem(index, fileName, singleton);
            }
          });
        }
      });
    }
    return searchResult;
  }

  static contains(letter, result) {
    const resultKeys = Object.keys(result);
    let check = false;
    resultKeys.forEach((key) => {
      if (letter === key) {
        check = true;
      }
    });
    return check;
  }
}
