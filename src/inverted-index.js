'use strict';

const InvertedIndexUtils = require('../utils/inverted-index-utils');

module.exports = class InvertedIndex {
  constructor() {
    this.filesIndexed = {};
  }
  createIndex(fileName, fileContent) {

  }

   searchIndex(index, fileName = 'all', ...terms) {

   }
};
