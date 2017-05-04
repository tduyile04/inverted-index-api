import express from 'express';
import bodyParser from 'body-parser';
import InvertedIndex from '../inverted-index';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.locals.indexedFile = {};

app.post('/api/create', (req, res) => {
  const newFile = req.body;
  const fileTitle = 'file-collection';
  const numFile = Object.keys(newFile);
  if (numFile === 1) {
    indexedFile[fileTitle] = InvertedIndex.createIndex(fileTitle, newFile);
  }
  if (numFile > 1) {
    newFile.forEach((file) => {
      indexedFile[fileTitle] = InvertedIndex.createIndex(fileTitle, file);
    });
  }
  res.json(indexedFile);
});

app.post('/api/search', (req, res) => {
  const newFile = req.body;
  const fileTitle = 'file-collection';
  indexedFile[fileTitle] = InvertedIndex.searchIndex(newFile);
  res.json(indexedFile);
});
