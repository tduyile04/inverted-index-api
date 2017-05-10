import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import multer from 'multer';
import { dotenv } from 'dotenv';
import InvertedIndex from '../inverted-index';
import InvertedIndexValidation from '../utils/inverted-index-validation';

// dotenv.config();
const upload = multer();
const indexDatabase = fs.readFileSync('./src/routes/database.json');
let database = JSON.parse(indexDatabase);
let port;

const app = express();

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

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Use the /api/create or the /api/search route');
});


app.post('/api/create', upload.array('books', 12), hasError, (req, res) => {
  const invertedIndex = new InvertedIndex();
  const files = req.files;
  const numFile = files.length;
  if (numFile === 1) {
    const newFile = JSON.parse(files[0].buffer);
    const fileTitle = files[0].originalname;
    const singleDatabase = invertedIndex.createIndex(fileTitle, newFile);
    const addDatabase = JSON.stringify(singleDatabase);
    fs.writeFileSync('./src/routes/database.json', addDatabase);
  }
  if (numFile > 1) {
    let fileTitle = '';
    files.forEach((file) => {
      let parsedFile = JSON.parse(file.buffer);
      fileTitle = file.originalname;
      let multipleDatabase = invertedIndex.createIndex(fileTitle, parsedFile);
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
  if (typeof fileName === 'undefined') {
    searchResult = invertedIndex.searchIndex(index, 'all', searchTerms);
  } else {
    searchResult = invertedIndex.searchIndex(index, fileName, searchTerms);
  }
  res.json(searchResult);
});
