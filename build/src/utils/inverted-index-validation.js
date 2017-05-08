'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 
 * 
 * @class InvertedIndexValidation
 */
var InvertedIndexValidation = function () {
  function InvertedIndexValidation() {
    _classCallCheck(this, InvertedIndexValidation);
  }

  _createClass(InvertedIndexValidation, null, [{
    key: 'isValidJSON',


    /**
     * 
     * 
     * @static
     * @param {any} docs
     * @returns
     * 
     * @memberOf InvertedIndexValidation
     */
    value: function isValidJSON(docs) {
      try {
        JSON.parse(docs);
        return true;
      } catch (e) {
        return false;
      }
    }

    /**
     * 
     * 
     * @static
     * @param {any} docs
     * @returns
     * 
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'isEmpty',
    value: function isEmpty(docs) {
      if (Object.keys(docs).length === 0) {
        return true;
      }
      return false;
    }

    /**
     * 
     * 
     * @static
     * @param {any} doc
     * @returns
     * 
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'isContentEmpty',
    value: function isContentEmpty(doc) {
      var bookHeader = 'title';
      var bookContent = 'text';
      if (doc[bookHeader].trim() === '' || doc[bookContent].trim() === '') {
        return true;
      }
      return false;
    }
  }, {
    key: 'isInvalidContent',
    value: function isInvalidContent(doc) {
      var bookHeader = 'title';
      var bookContent = 'text';
      if (typeof doc[bookHeader] !== 'string' || typeof doc[bookContent] !== 'string') {
        return true;
      }
      return false;
    }
  }, {
    key: 'isInvalidFormat',
    value: function isInvalidFormat(doc) {
      var bookHeader = 'title';
      var bookContent = 'text';
      var key = Object.keys(doc);
      if (key.length !== 2) {
        return true;
      }
      if (key[0] !== bookHeader || key[1] !== bookContent) {
        return true;
      }
      return false;
    }
  }, {
    key: 'checkValidJSON',
    value: function checkValidJSON(docs) {
      var errorMessage = '';
      if (!InvertedIndexValidation.isValidJSON(docs)) {
        errorMessage = 'Invalid JSON';
      }
      return errorMessage;
    }
  }, {
    key: 'checkEmptyError',
    value: function checkEmptyError(docs) {
      var errorMessage = '';

      if (InvertedIndexValidation.isEmpty(docs)) {
        errorMessage = 'Empty documents are invalid';
      }
      return errorMessage;
    }
  }, {
    key: 'checkEmptyContent',
    value: function checkEmptyContent(docs) {
      var errorMessage = '';
      docs.forEach(function (doc) {
        if (InvertedIndexValidation.isContentEmpty(doc)) {
          errorMessage = 'Book title and text entry cannot be empty';
        }
      });
      return errorMessage;
    }
  }, {
    key: 'checkFormatValidity',
    value: function checkFormatValidity(docs) {
      var errorMessage = '';
      docs.forEach(function (doc) {
        if (InvertedIndexValidation.isInvalidFormat(doc)) {
          errorMessage = 'The book must have both title and text properties';
        }
      });
      return errorMessage;
    }
  }, {
    key: 'checkContentValidity',
    value: function checkContentValidity(docs) {
      var errorMessage = '';
      docs.forEach(function (doc) {
        if (InvertedIndexValidation.isInvalidContent(doc)) {
          errorMessage = 'Only string inputs are accepted as title and text';
        }
      });
      return errorMessage;
    }
  }, {
    key: 'hasError',
    value: function hasError(docs) {
      var errorMessage = '';
      if (InvertedIndexValidation.checkValidJSON(docs)) {
        errorMessage = InvertedIndexValidation.checkValidJSON(docs);
      }
      if (InvertedIndexValidation.checkEmptyError(docs)) {
        errorMessage = InvertedIndexValidation.checkEmptyError(docs);
        return errorMessage;
      }
      if (InvertedIndexValidation.checkEmptyContent(docs)) {
        errorMessage = InvertedIndexValidation.checkEmptyContent(docs);
        return errorMessage;
      }
      if (InvertedIndexValidation.checkFormatValidity(docs)) {
        errorMessage = InvertedIndexValidation.checkFormatValidity(docs);
        return errorMessage;
      }
      if (InvertedIndexValidation.checkContentValidity(docs)) {
        errorMessage = InvertedIndexValidation.checkContentValidity(docs);
        return errorMessage;
      }
      return false;
    }
  }]);

  return InvertedIndexValidation;
}();

exports.default = InvertedIndexValidation;