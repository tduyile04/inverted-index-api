'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _dotenv = require('dotenv');

var _invertedIndex = require('../inverted-index');

var _invertedIndex2 = _interopRequireDefault(_invertedIndex);

var _invertedIndexValidation = require('../utils/inverted-index-validation');

var _invertedIndexValidation2 = _interopRequireDefault(_invertedIndexValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// dotenv.config();

var upload = (0, _multer2.default)();
var indexDatabase = _fs2.default.readFileSync('./src/routes/database.json');
var database = JSON.parse(indexDatabase);
var port = void 0;

var app = (0, _express2.default)();

// switch (process.env.NODE_ENV) {
//   case 'test':
//     app.set(port, process.env.PORT_TEST);
//     break;
//   case 'development':
//     app.set(port, process.env.PORT_DEV);
//     break;
//   case 'production':
//     app.set(port, process.env.PORT_PROD);
//     break;
//   default:
//     app.set(port, process.env.PORT_DEV);
//     break;
// }

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.send('Use the /api/create or the /api/search route');
});

app.get('/api/create', function (req, res) {
  var book = [{
    title: 'harry porter',
    text: 'The boy who was destined to defeat Lord Voldermort'
  }, {
    title: 'The Sorceres stone',
    text: 'The first book of the harry porter series'
  }, {
    title: 'a b c',
    text: 'd e f x'
  }, {
    title: 'a g b',
    text: 'd,f x y z x'
  }];

  var invertedIndex = new _invertedIndex2.default();
  invertedIndex.createIndex('book', book);
  res.json(invertedIndex.filesIndexed);
});

app.get('/api/search', function (req, res) {
  var index = {
    book: { harry: [0, 1], porter: [0, 1], the: [0, 1], boy: [0], who: [0], was: [0], destined: [0],
      to: [0], defeat: [0], lord: [0], voldermort: [0], sorceres: [1], stone: [1],
      first: [1], book: [1], of: [1], series: [1] }
  };
  var book = [{
    title: 'harry porter',
    text: 'The boy who was destined to defeat Lord Voldermort'
  }, {
    title: 'The Sorceres stone',
    text: 'The first book of the harry porter series'
  }, {
    title: 'a b c',
    text: 'd e f x'
  }, {
    title: 'a g b',
    text: 'd,f x y z x'
  }];
  var invertedIndex = new _invertedIndex2.default();
  invertedIndex.createIndex('book', book);
  var searchResults = invertedIndex.searchIndex(index, 'book', 'harry');
  res.json(searchResults);
});

app.post('/api/create', upload.array('books', 12), function (req, res) {
  var invertedIndex = new _invertedIndex2.default();
  var files = req.files;
  var numFile = files.length;
  if (numFile === 1) {
    var newFile = JSON.parse(files[0].buffer);
    var fileTitle = files[0].originalname;
    if (_invertedIndexValidation2.default.hasError(newFile)) {
      var errorMessage = _invertedIndexValidation2.default.hasError(newFile);
      res.json({ error: errorMessage });
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
      if (_invertedIndexValidation2.default.hasError(parsedFile)) {
        var _errorMessage = _invertedIndexValidation2.default.hasError(parsedFile);
        res.json({ error: _errorMessage });
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
  if (typeof fileName === 'undefined') {
    searchResult = invertedIndex.searchIndex(index, 'all', searchTerms);
  } else {
    searchResult = invertedIndex.searchIndex(index, fileName, searchTerms);
  }
  res.json(searchResult);
});