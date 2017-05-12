'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _invertedIndex = require('../inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _invertedIndexValidation = require('../utils/inverted-index-validation');

var _invertedIndexValidation2 = _interopRequireDefault(_invertedIndexValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)();
var app = (0, _express2.default)();

var port = process.env.PORT || 3000;
var server = app.listen(port);

/**
 * A middleware that validates the users input and sends it to the next function
 * if the input is rightly formatted else terminates with the appropriate
 * error message
 * @param {any} req - A stream of the request sent in by the user
 * @param {any} res - A stream of the response sent by the server
 * @param {any} next - A call to the next middleware function
 * @returns{res} - error message if the input is bad
 */
function hasError(req, res, next) {
  var files = req.files;
  var fileLength = files.length;
  if (fileLength === 1) {
    var file = void 0;
    try {
      file = JSON.parse(files[0].buffer);
    } catch (e) {
      res.status(400);
      res.json({ error: 'Invalid JSON' });
      res.end();
    }

    if (_invertedIndexValidation2.default.hasSyntaxError(file)) {
      var errorMessage = _invertedIndexValidation2.default.hasSyntaxError(file);
      res.status(400);
      res.json({ error: errorMessage });
      res.end();
    } else {
      next();
    }
  } else if (fileLength > 1) {
    files.forEach(function (file) {
      var parsedFile = void 0;
      try {
        parsedFile = JSON.parse(file.buffer);
      } catch (e) {
        res.status(400);
        res.json({ error: 'Invalid JSON' });
        res.end();
      }

      if (_invertedIndexValidation2.default.hasSyntaxError(parsedFile)) {
        var _errorMessage = _invertedIndexValidation2.default.hasSyntaxError(parsedFile);
        res.status(400);
        res.json({ error: _errorMessage });
        res.end();
      }
    });
    next();
  }
}

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.post('/api/create', upload.array('books', 12), hasError, function (req, res) {
  var invertedIndex = new _invertedIndex2.default();
  var files = req.files;
  var numFile = files.length;

  if (numFile === 1) {
    var newFile = JSON.parse(files[0].buffer);
    var fileTitle = files[0].originalname;
    if (!fileTitle) {
      res.status(401);
      res.json({ error: 'File title cannot be empty' });
      res.end();
    }
    if (!newFile) {
      res.status(401);
      res.json({ error: 'File content cannot be empty' });
      res.end();
    }
    var singleDatabase = invertedIndex.createIndex(fileTitle, newFile);
    var addDatabase = JSON.stringify(singleDatabase);
    _fs2.default.writeFileSync('./src/routes/database.json', addDatabase);
  }

  if (numFile > 1) {
    var _fileTitle = '';
    files.forEach(function (file) {
      var parsedFile = JSON.parse(file.buffer);
      _fileTitle = file.originalname;
      if (!_fileTitle) {
        res.status(401);
        res.json({ error: 'File title cannot be empty' });
        res.end();
      }
      if (!parsedFile) {
        res.status(401);
        res.json({ error: 'File content cannot be empty' });
        res.end();
      }
      var multipleDatabase = invertedIndex.createIndex(_fileTitle, parsedFile);
      var addDatabase = JSON.stringify(multipleDatabase);
      _fs2.default.writeFileSync('./src/routes/database.json', addDatabase);
    });
  }

  var currentDatabase = _fs2.default.readFileSync('./src/routes/database.json');
  currentDatabase = JSON.parse(currentDatabase);
  res.json(currentDatabase);
});

app.post('/api/search', function (req, res) {
  var invertedIndex = new _invertedIndex2.default();
  var searchTerms = req.body.search;
  var fileName = req.body.fileName;
  var db = _fs2.default.readFileSync('./src/routes/database.json');
  var index = JSON.parse(db);
  var searchResult = '';

  if (index === null) {
    res.status(401);
    res.json({ error: 'No index has been created' });
  }

  if (typeof fileName === 'undefined') {
    if (!searchTerms) {
      res.status(401);
      res.json({ error: 'Search query cannot be empty' });
      res.end();
    }
    searchResult = invertedIndex.searchIndex(index, '', searchTerms);
  } else {
    if (!searchTerms) {
      res.status(401);
      res.json({ error: 'Search query cannot be empty' });
      res.end();
    }
    searchResult = invertedIndex.searchIndex(index, fileName, searchTerms);
  }
  res.json(searchResult);
});

exports.default = server;