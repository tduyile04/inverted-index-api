/**
 * Helper class for create and seach index functionalities
 * @class InvertedIndexUtils
 */
export default class InvertedIndexUtils {

  /**
   * Removes repetitive words from an array
   * @static
   * @param {any} arr - Document terms that might have repetitive words
   * @returns {Array} - A set(unique tokens) of the array input
   * @memberOf InvertedIndexUtils
   */
  static removeDuplicates(arr) {
    const check = {};
    const result = [];
    arr.forEach((item) => {
      if (!check[item]) {
        check[item] = true;
        result.push(item);
      }
    });
    return result;
  }

  /**
   * Sanitizes the search value of all user typo, unknowingly or maliciously
   * @static
   * @param {any} search - The value to be searched
   * @returns {string} - A sanitized search query
   * @memberOf InvertedIndexUtils
   */
  static sanitizeSearchQuery(search) {
    search = search.toLowerCase()
    .replace(/-/g, ' ')
    .replace(/[^A-z\s]/g, ' ')
    .split(' ');
    return search;
  }
  /**
   * Creates unique words without special characters and converts all
   * to lowercase for consistency
   * @static
   * @param {any} input - A string of words
   * @returns {Array} - A set of unique words without special characters
   *                    and inconsistent character casing
   * @memberOf InvertedIndexUtils
   */
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

  /**
   * Joins the title and text property of each documents
   * @static
   * @param {any} books - An array of books classified into distinct titles and texts
   * @returns {Array} - An array of documents grouped by joining its titles and texts
   * @memberOf InvertedIndexUtils
   */
  static concatTitleAndText(books) {
    const space = ' ';
    const addContents = books.map((book) => {
      const str = book.title.concat(space + book.text);
      return str;
    });
    return addContents;
  }

  /**
   * Splits the grouped documents into unique tokens
   * @static
   * @param {any} bookArray - An array of documents grouped by joining its titles and texts
   * @returns {Array} - An array of grouped unique tokens
   * @memberOf InvertedIndexUtils
   */
  static produceUniqueTokens(bookArray) {
    const result = [];
    bookArray.forEach((book) => {
      const temp = InvertedIndexUtils.sanitizeInput(book);
      result.push([...temp]);
    });
    return result;
  }

  /**
   * 
   * Converts the grouped documents of unique tokens into an index
   * @static
   * @param {any} terms - An array of grouped unique tokens
   * @returns {Object} - A map of the unique tokens to its corresponding index
   * @memberOf InvertedIndexUtils
   */
  static convertTokensToIndexes(terms) {
    const result = {};
    const check = {};

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

  /**
   * Checks if the item is in the specified book/file
   * @static
   * @param {any} index - A map of the unique tokens to its corresponding index
   * @param {any} fileName - The name of the file to be searched
   * @param {any} item - The required value to be searched
   * @returns {Number|string} - correct index if found or 'not found' if otherwise
   * @memberOf InvertedIndexUtils
   */
  static findSearchItem(index, fileName, item) {
    let result = {};
    if (InvertedIndexUtils.contains(item, index[fileName])) {
      result = index[fileName][item];
    } else {
      result = 'not found';
    }
    return result;
  }

  /**
   * Searches a book and returns a map of the index showing presence/absence
   * @static
   * @param {any} index - A map of the unique tokens to its corresponding index
   * @param {any} fileName - The name of the file to be searched
   * @param {any} terms - The required value(s) to be searched
   * @returns {Object} - A map of the searched book to its index if found and
   *                     'not found' if not present in the file
   * @memberOf InvertedIndexUtils
   */
  static searchBook(index, fileName, ...terms) {
    const searchResult = {};
    if (terms.length === 1) {
      let newElement = terms[0];
      newElement = InvertedIndexUtils.sanitizeSearchQuery(newElement);
      if (newElement.length === 1) {
        const firstElement = newElement[0];
        searchResult[firstElement] = InvertedIndexUtils
                                      .findSearchItem(index, fileName, firstElement);
      } else {
        newElement.forEach((element) => {
          searchResult[element] = InvertedIndexUtils.findSearchItem(index, fileName, element);
        });
      }
    } else {
      terms.forEach((element) => {
        if (typeof element === 'string') {
          element = InvertedIndexUtils.sanitizeSearchQuery(element);
          if (element.length === 1) {
            const firstElement = element[0];
            searchResult[firstElement] = InvertedIndexUtils
                                          .findSearchItem(index, fileName, firstElement);
          } else {
            element.forEach((newElement) => {
              searchResult[newElement] = InvertedIndexUtils
                                          .findSearchItem(index, fileName, newElement);
            });
          }
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

  /**
   * Checks if a value is in an object
   * @static
   * @param {any} letter - value
   * @param {any} result - object
   * @returns {boolean} - True if present and false otherwise
   * @memberOf InvertedIndexUtils
   */
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
