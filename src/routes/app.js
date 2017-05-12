import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import multer from 'multer';
import InvertedIndex from '../inverted-index';
import InvertedIndexValidation from '../utils/inverted-index-validation';

const upload = multer();
const app = express();

const server = app.listen(3000, () => {
  console.log('Listening on port 3000');
});

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
  const files = req.files;
  const fileLength = files.length;
  if (fileLength === 1) {
    let file;
    try {
      file = JSON.parse(files[0].buffer);
    } catch (e) {
      res.json({ error: 'Invalid JSON' });
      res.end();
    }
    if (InvertedIndexValidation.hasSyntaxError(file)) {
      const errorMessage = InvertedIndexValidation.hasSyntaxError(file);
      res.json({ error: errorMessage });
      res.end();
    } else {
      next();
    }
  } else if (fileLength > 1) {
    files.forEach((file) => {
      let parsedFile;
      try {
        parsedFile = JSON.parse(file.buffer);
      } catch (e) {
        res.json({ error: 'Invalid JSON' });
        res.end();
      }
      if (InvertedIndexValidation.hasSyntaxError(parsedFile)) {
        const errorMessage = InvertedIndexValidation.hasSyntaxError(parsedFile);
        res.json({ error: errorMessage });
        res.end();
      }
    });
    next();
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/create', upload.array('books', 12), hasError, (req, res) => {
  const invertedIndex = new InvertedIndex();
  const files = req.files;
  const numFile = files.length;
  if (numFile === 1) {
    const newFile = JSON.parse(files[0].buffer);
    const fileTitle = files[0].originalname;
    if (!fileTitle) {
      res.json({ error: 'File title cannot be empty' });
      res.end();
    }
    if (!newFile) {
      res.json({ error: 'File content cannot be empty' });
      res.end();
    }
    const singleDatabase = invertedIndex.createIndex(fileTitle, newFile);
    const addDatabase = JSON.stringify(singleDatabase);
    fs.writeFileSync('./src/routes/database.json', addDatabase);
  }
  if (numFile > 1) {
    let fileTitle = '';
    files.forEach((file) => {
      const parsedFile = JSON.parse(file.buffer);
      fileTitle = file.originalname;
      if (!fileTitle) {
        res.json({ error: 'File title cannot be empty' });
        res.end();
      }
      if (!parsedFile) {
        res.json({ error: 'File content cannot be empty' });
        res.end();
      }
      const multipleDatabase = invertedIndex.createIndex(fileTitle, parsedFile);
      const addDatabase = JSON.stringify(multipleDatabase);
      fs.writeFileSync('./src/routes/database.json', addDatabase);
    });
  }
  let currentDatabase = fs.readFileSync('./src/routes/database.json');
  currentDatabase = JSON.parse(currentDatabase);
  res.json(currentDatabase);
});

app.post('/api/search', (req, res) => {
  const invertedIndex = new InvertedIndex();
  const searchTerms = req.body.search;
  const fileName = req.body.fileName;
  const db = fs.readFileSync('./src/routes/database.json');
  const index = JSON.parse(db);
  let searchResult = '';
  if (index === null) {
    res.json({ error: 'No index has been created' });
  }
  if (typeof fileName === 'undefined') {
    if (!searchTerms) {
      res.json({ error: 'Search query cannot be empty' });
      res.end();
    }
    searchResult = invertedIndex.searchIndex(index, '', searchTerms);
  } else {
    if (!searchTerms) {
      res.json({ error: 'Search query cannot be empty' });
      res.end();
    }
    searchResult = invertedIndex.searchIndex(index, fileName, searchTerms);
  }
  res.json(searchResult);
});

export default server;
