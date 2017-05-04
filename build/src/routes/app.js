'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var InvertedIndex = require('../inverted-index');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, function () {
  console.log('Listening on port 3000');
});

app.locals.indexedFile = {};

app.post('/api/create', function (req, res) {
  var newFile = req.body;
  var fileTitle = 'file-collection';
  var numFile = Object.keys(newFile);
  if (numFile === 1) {
    indexedFile[fileTitle] = InvertedIndex.createIndex(fileTitle, newFile);
  }
  if (numFile > 1) {
    newFile.forEach(function (file) {
      indexedFile[fileTitle] = InvertedIndex.createIndex(fileTitle, file);
    });
  }
  res.json(indexedFile);
});

app.post('/api/search', function (req, res) {
  var newFile = req.body;
  var fileTitle = 'file-collection';
  indexedFile[fileTitle] = InvertedIndex.searchIndex(newFile);
  res.json(indexedFile);
});