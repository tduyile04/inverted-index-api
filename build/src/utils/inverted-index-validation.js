'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A collection of validations to sanitize document input
 * @class InvertedIndexValidation
 */
var InvertedIndexValidation = function () {
  function InvertedIndexValidation() {
    _classCallCheck(this, InvertedIndexValidation);
  }

  _createClass(InvertedIndexValidation, null, [{
    key: 'isValidJSON',


    /**
     * This methods check if a document is valid JSON
     * @static
     * @param {any} docs - The document to be validated
     * @returns {boolean} - True if the document is valid JSON or false otherwise
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
     * This method checks if the document is empty
     * @static
     * @param {any} docs - The document to be validated
     * @returns {boolean} - True if the document is empty or false otherwise
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
     * This method checks if any of the document content is left blank
     * @static
     * @param {any} doc - The document to be validated
     * @returns {boolean} - True if any of the document's content is empty or false otherwise
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'isContentEmpty',
    value: function isContentEmpty(doc) {
      var bookHeader = 'title';
      var bookContent = 'text';
      if (doc[bookHeader] === '' || doc[bookContent] === '') {
        return true;
      }
      return false;
    }

    /**
     * This method checks if any of the document has an invalid content type
     * @static
     * @param {any} doc - The document to be validated
     * @returns {boolean} - True if all contents passes the validation or false otherwise
     * @memberOf InvertedIndexValidation
     */

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

    /**
     * This method checks if the document is in the right format
     * @static
     * @param {any} doc - The document to be validated
     * @returns {boolean} - True if the document is in the right format and false otherwise
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'isInvalidFormat',
    value: function isInvalidFormat(doc) {
      var bookHeader = 'title';
      var bookContent = 'text';
      var keys = Object.keys(doc);
      if (keys.length !== 2) {
        return true;
      }
      if (keys[0] !== bookHeader || keys[1] !== bookContent) {
        return true;
      }
      if (!doc.bookHeader || !doc.bookContent) {
        return true;
      }
      return false;
    }
    /**
     * Provides suitable error message for invalid JSON documents
     * @static
     * @param {any} docs - The document to be validated
     * @returns {string} - The appropriate error message
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'checkValidJSON',
    value: function checkValidJSON(docs) {
      var errorMessage = '';
      if (!InvertedIndexValidation.isValidJSON(docs)) {
        errorMessage = 'Invalid JSON';
      }
      return errorMessage;
    }
    /**
     * Provides suitable error message for empty documents
     * @static
     * @param {any} docs - The document to be validated
     * @returns {string} - The appropriate error message
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'checkEmptyError',
    value: function checkEmptyError(docs) {
      var errorMessage = '';

      if (InvertedIndexValidation.isEmpty(docs)) {
        errorMessage = 'Empty documents are invalid';
      }
      return errorMessage;
    }

    /**
     * Provides suitable error message if document has empty contents
     * @static
     * @param {any} docs - The document to be validated
     * @returns {string} - The appropriate error message
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'checkEmptyContent',
    value: function checkEmptyContent(docs) {
      var errorMessage = '';
      if (docs.length && docs.length > 1) {
        docs.forEach(function (doc) {
          if (InvertedIndexValidation.isContentEmpty(doc)) {
            errorMessage = 'Book title and text entry cannot be empty';
          }
        });
      }
      if (InvertedIndexValidation.isContentEmpty(docs)) {
        errorMessage = 'Book title and text entry cannot be empty';
      }
      return errorMessage;
    }

    /**
     * Provides suitable error message if document has empty contents
     * @static
     * @param {any} docs - The document to be validated
     * @returns {string} - The appropriate error message
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'checkFormatValidity',
    value: function checkFormatValidity(docs) {
      var errorMessage = '';
      if (docs.length && docs.length > 1) {
        docs.forEach(function (doc) {
          if (InvertedIndexValidation.isInvalidFormat(doc)) {
            errorMessage = 'The book must have both title and text properties';
          }
        });
      }
      if (InvertedIndexValidation.isInvalidFormat(docs)) {
        errorMessage = 'The book must have both title and text properties';
      }
      return errorMessage;
    }

    /**
     * Provides suitable error message if document has invalid contents
     * @static
     * @param {any} docs - The document to be validated
     * @returns {string} - The appropriate error message
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'checkContentValidity',
    value: function checkContentValidity(docs) {
      var errorMessage = '';
      if (docs.length && docs.length > 1) {
        docs.forEach(function (doc) {
          if (InvertedIndexValidation.isInvalidContent(doc)) {
            errorMessage = 'Only string inputs are accepted as title and text';
          }
        });
      }
      if (InvertedIndexValidation.isInvalidContent(docs)) {
        errorMessage = 'Only string inputs are accepted as title and text';
      }
      return errorMessage;
    }

    /**
     * Bundles the syntax validations into one functionality
     * @static
     * @param {any} docs - The document to be validated
     * @returns {string} - The appropriate error message
     * @memberOf InvertedIndexValidation
     */

  }, {
    key: 'hasSyntaxError',
    value: function hasSyntaxError(docs) {
      var errorMessage = '';
      if (InvertedIndexValidation.isEmpty(docs)) {
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