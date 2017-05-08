'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * 
 * @class InvertedIndexUtils
 */
var InvertedIndexUtils = function () {
  function InvertedIndexUtils() {
    _classCallCheck(this, InvertedIndexUtils);
  }

  _createClass(InvertedIndexUtils, null, [{
    key: 'removeDuplicates',
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
  }, {
    key: 'findSearchItem',
    value: function findSearchItem(index, fileName, item) {
      var result = {};
      if (InvertedIndexUtils.contains(item, index[fileName])) {
        result = index[fileName][item];
      } else {
        result = false;
      }
      return result;
    }
  }, {
    key: 'searchBook',
    value: function searchBook(index, fileName) {
      var searchResult = {};

      for (var _len = arguments.length, terms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        terms[_key - 2] = arguments[_key];
      }

      if (terms.length === 1) {
        var firstElement = terms[0];
        searchResult[firstElement] = InvertedIndexUtils.findSearchItem(index, fileName, firstElement);
      } else {
        terms.forEach(function (element) {
          if (typeof element === 'string') {
            searchResult[element] = InvertedIndexUtils.findSearchItem(index, fileName, element);
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