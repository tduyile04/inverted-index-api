'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InvertedIndexUtils = require('./utils/inverted-index-utils');

module.exports = function () {
  function InvertedIndex() {
    _classCallCheck(this, InvertedIndex);

    this.filesIndexed = {};
  }

  _createClass(InvertedIndex, [{
    key: 'createIndex',
    value: function createIndex(fileName, fileContent) {
      var bookTokens = InvertedIndexUtils.concatTitleAndText(fileContent);
      var uniqueContent = InvertedIndexUtils.produceUniqueTokens(bookTokens);
      var index = InvertedIndexUtils.convertTokensToIndexes(uniqueContent);
      this.indexedFiles[fileName] = index;
      return this.filesIndexed || false;
    }
  }, {
    key: 'searchIndex',
    value: function searchIndex(index) {
      for (var _len = arguments.length, terms = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        terms[_key - 2] = arguments[_key];
      }

      var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'all';

      var result = {};
      if (fileName !== 'all') {
        result[fileName] = InvertedIndexUtils.searchBook.apply(InvertedIndexUtils, [index, fileName].concat(terms));
      } else {
        var bookList = Object.keys(index);
        bookList.forEach(function (book) {
          result[fileName] = InvertedIndexUtils.searchBook.apply(InvertedIndexUtils, [index, book].concat(terms));
        });
      }
      return result;
    }
  }]);

  return InvertedIndex;
}();