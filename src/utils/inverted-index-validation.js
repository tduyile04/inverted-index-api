/**
 * 
 * 
 * @class InvertedIndexValidation
 */
export default class InvertedIndexValidation {

  /**
   * 
   * 
   * @static
   * @param {any} docs
   * @returns
   * 
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
   * 
   * 
   * @static
   * @param {any} docs
   * @returns
   * 
   * @memberOf InvertedIndexValidation
   */
  static isEmpty(docs) {
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
  static isContentEmpty(doc) {
    const bookHeader = 'title';
    const bookContent = 'text';
    if (doc[bookHeader].trim() === '' || doc[bookContent].trim() === '') {
      return true;
    }
    return false;
  }
  static isInvalidContent(doc) {
    const bookHeader = 'title';
    const bookContent = 'text';
    if (typeof doc[bookHeader] !== 'string' || typeof doc[bookContent] !== 'string') {
      return true;
    }
    return false;
  }
  static isInvalidFormat(doc) {
    const bookHeader = 'title';
    const bookContent = 'text';
    const key = Object.keys(doc);
    if (key.length !== 2) {
      return true;
    }
    if (key[0] !== bookHeader || key[1] !== bookContent) {
      return true;
    }
    return false;
  }
  static checkValidJSON(docs) {
    let errorMessage = '';
    if (!InvertedIndexValidation.isValidJSON(docs)) {
      errorMessage = 'Invalid JSON';
    }
    return errorMessage;
  }
  static checkEmptyError(docs) {
    let errorMessage = '';

    if (InvertedIndexValidation.isEmpty(docs)) {
      errorMessage = 'Empty documents are invalid';
    }
    return errorMessage;
  }

  static checkEmptyContent(docs) {
    let errorMessage = '';
    docs.forEach((doc) => {
      if (InvertedIndexValidation.isContentEmpty(doc)) {
        errorMessage = 'Book title and text entry cannot be empty';
      }
    });
    return errorMessage;
  }

  static checkFormatValidity(docs) {
    let errorMessage = '';
    docs.forEach((doc) => {
      if (InvertedIndexValidation.isInvalidFormat(doc)) {
        errorMessage = 'The book must have both title and text properties';
      }
    });
    return errorMessage;
  }

  static checkContentValidity(docs) {
    let errorMessage = '';
    docs.forEach((doc) => {
      if (InvertedIndexValidation.isInvalidContent(doc)) {
        errorMessage = 'Only string inputs are accepted as title and text';
      }
    });
    return errorMessage;
  }

  static hasError(docs) {
    let errorMessage = '';
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

}
