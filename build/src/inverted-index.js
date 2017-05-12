'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _invertedIndexUtils = require('./utils/inverted-index-utils');

var _invertedIndexUtils2 = _interopRequireDefault(_invertedIndexUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Creates index for files and search for words in files already indexed
 * @export
 * @class InvertedIndex
 */
var InvertedIndex = function () {
  /**
   * Creates an instance of InvertedIndex.
   * Initializes a fileIndexed object that stores created index
   * @memberOf InvertedIndex
   */
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.filesIndexed = {};
  }
  /**
   * Creates index for files
   * @param {any} fileName - The name of the file to be indexed
   * @param {any} fileContent - The content of the file to be indexed
   * @returns {Object} - The map of the files indexed to its unique tokens
   * @memberOf InvertedIndex
   */


  _createClass(InvertedIndex, [{
    key: 'createIndex',
    value: function createIndex(fileName, fileContent) {
      var bookTokens = _invertedIndexUtils2.default.concatTitleAndText(fileContent);
      var uniqueContent = _invertedIndexUtils2.default.produceUniqueTokens(bookTokens);
      var index = _invertedIndexUtils2.default.convertTokensToIndexes(uniqueContent);
      this.filesIndexed[fileName] = index;
      return this.filesIndexed;
    }

    /**
     * 
     * 
     * @param {any} index - A map of the unique tokens to its corresponding index
     * @param {string} fileName - The name of the file(s) to be indexed
     * @param {any} terms - The required value(s) to be searched
     * @returns {Object} -  A map of the searched book to its index if found and
     *                     'not found' if not present in the file
     * @memberOf InvertedIndex
     */

  }, {
    key: 'searchIndex',
    value: function searchIndex(index) {
      for (var _len = arguments.length, terms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        terms[_key - 2] = arguments[_key];
      }

      var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var result = {};
      var checkFileName = fileName || '';
      if (!checkFileName || typeof checkFileName === 'undefined') {
        var bookList = Object.keys(index);
        bookList.forEach(function (book) {
          result[book] = _invertedIndexUtils2.default.searchBook.apply(_invertedIndexUtils2.default, [index, book].concat(terms));
        });
      } else {
        result[fileName] = _invertedIndexUtils2.default.searchBook.apply(_invertedIndexUtils2.default, [index, fileName].concat(terms));
      }
      return result;
    }
  }]);

  return InvertedIndex;
}();

exports.default = InvertedIndex;