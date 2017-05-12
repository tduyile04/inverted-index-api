'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Helper class for create and seach index functionalities
 * @class InvertedIndexUtils
 */
var InvertedIndexUtils = function () {
  function InvertedIndexUtils() {
    _classCallCheck(this, InvertedIndexUtils);
  }

  _createClass(InvertedIndexUtils, null, [{
    key: 'removeDuplicates',


    /**
     * Removes repetitive words from an array
     * @static
     * @param {any} arr - Document terms that might have repetitive words
     * @returns {Array} - A set(unique tokens) of the array input
     * @memberOf InvertedIndexUtils
     */
    value: function removeDuplicates(arr) {
      var check = {};
      var result = [];
      arr.forEach(function (item) {
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

  }, {
    key: 'sanitizeSearchQuery',
    value: function sanitizeSearchQuery(search) {
      search = search.toLowerCase().replace(/-/g, ' ').replace(/[^A-z\s]/g, ' ').split(' ');
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

  }, {
    key: 'sanitizeInput',
    value: function sanitizeInput(input) {
      input = input.toLowerCase().replace(/-/g, ' ').replace(/[^A-z\s]/g, '').split(' ');
      var result = [];
      input.forEach(function (word) {
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

  }, {
    key: 'concatTitleAndText',
    value: function concatTitleAndText(books) {
      var space = ' ';
      var addContents = books.map(function (book) {
        var str = book.title.concat(space + book.text);
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

  }, {
    key: 'produceUniqueTokens',
    value: function produceUniqueTokens(bookArray) {
      var result = [];
      bookArray.forEach(function (book) {
        var temp = InvertedIndexUtils.sanitizeInput(book);
        result.push([].concat(_toConsumableArray(temp)));
      });
      return result;
    }

    /**
     * Converts the grouped documents of unique tokens into an index
     * @static
     * @param {any} terms - An array of grouped unique tokens
     * @returns {Object} - A map of the unique tokens to its corresponding index
     * @memberOf InvertedIndexUtils
     */

  }, {
    key: 'convertTokensToIndexes',
    value: function convertTokensToIndexes(terms) {
      var result = {};
      var check = {};

      terms.forEach(function (term, index) {
        term.forEach(function (member) {
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

  }, {
    key: 'findSearchItem',
    value: function findSearchItem(index, fileName, item) {
      var result = {};
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

  }, {
    key: 'searchBook',
    value: function searchBook(index, fileName) {
      var searchResult = {};

      for (var _len = arguments.length, terms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        terms[_key - 2] = arguments[_key];
      }

      if (terms.length === 1) {
        var newElement = terms[0];
        newElement = InvertedIndexUtils.sanitizeSearchQuery(newElement);

        if (newElement.length === 1) {
          var firstElement = newElement[0];
          searchResult[firstElement] = InvertedIndexUtils.findSearchItem(index, fileName, firstElement);
        } else {
          newElement.forEach(function (element) {
            searchResult[element] = InvertedIndexUtils.findSearchItem(index, fileName, element);
          });
        }
      }

      if (terms.length > 1) {
        terms.forEach(function (element) {
          if (typeof element === 'string') {
            element = InvertedIndexUtils.sanitizeSearchQuery(element);
            if (element.length === 1) {
              var _firstElement = element[0];
              searchResult[_firstElement] = InvertedIndexUtils.findSearchItem(index, fileName, _firstElement);
            } else {
              element.forEach(function (newElement) {
                searchResult[newElement] = InvertedIndexUtils.findSearchItem(index, fileName, newElement);
              });
            }
          }

          if (element.constructor === Array) {
            element.forEach(function (singleton) {
              if (typeof element === 'string') {
                searchResult[singleton] = InvertedIndexUtils.findSearchItem(index, fileName, singleton);
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

  }, {
    key: 'contains',
    value: function contains(letter, result) {
      var resultKeys = Object.keys(result);
      var check = false;
      resultKeys.forEach(function (key) {
        if (letter === key) {
          check = true;
        }
      });
      return check;
    }
  }]);

  return InvertedIndexUtils;
}();

exports.default = InvertedIndexUtils;