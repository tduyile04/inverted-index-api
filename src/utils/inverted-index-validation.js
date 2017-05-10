/**
 * A collection of validations to sanitize document input
 * @class InvertedIndexValidation
 */
export default class InvertedIndexValidation {

  /**
   * This methods check if a document is valid JSON
   * @static
   * @param {any} docs - The document to be validated
   * @returns {boolean} - True if the document is valid JSON or false otherwise
   * @memberOf InvertedIndexValidation
   */
  static isValidJSON(docs) {
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
  static isEmpty(docs) {
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
  static isContentEmpty(doc) {
    const bookHeader = 'title';
    const bookContent = 'text';
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
  static isInvalidContent(doc) {
    const bookHeader = 'title';
    const bookContent = 'text';
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
  static isInvalidFormat(doc) {
    const bookHeader = 'title';
    const bookContent = 'text';
    const keys = Object.keys(doc);
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
  static checkValidJSON(docs) {
    let errorMessage = '';
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
  static checkEmptyError(docs) {
    let errorMessage = '';

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
  static checkEmptyContent(docs) {
    let errorMessage = '';
    if (docs.length && docs.length > 1) {
      docs.forEach((doc) => {
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
  static checkFormatValidity(docs) {
    let errorMessage = '';
    if (docs.length && docs.length > 1) {
      docs.forEach((doc) => {
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
  static checkContentValidity(docs) {
    let errorMessage = '';
    if (docs.length && docs.length > 1) {
      docs.forEach((doc) => {
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
  static hasSyntaxError(docs) {
    let errorMessage = '';
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
}
