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

app.get('/api/create', (req, res) => {
  const book = [
    {
      title: 'harry porter',
      text: 'The boy who was destined to defeat Lord Voldermort'
    },
    {
      title: 'The Sorceres stone',
      text: 'The first book of the harry porter series'
    },
    {
      title: 'a b c',
      text: 'd e f x'
    },
    {
      title: 'a g b',
      text: 'd,f x y z x'
    }
  ];

  const invertedIndex = new InvertedIndex();
  invertedIndex.createIndex('book', book);
  res.json(invertedIndex.filesIndexed);
});

app.get('/api/search', (req, res) => {
  const index = {
    book: { harry: [0, 1], porter: [0, 1], the: [0, 1], boy: [0], who: [0], was: [0], destined: [0],
      to: [0], defeat: [0], lord: [0], voldermort: [0], sorceres: [1], stone: [1],
      first: [1], book: [1], of: [1], series: [1] }
  };
  const book = [
    {
      title: 'harry porter',
      text: 'The boy who was destined to defeat Lord Voldermort'
    },
    {
      title: 'The Sorceres stone',
      text: 'The first book of the harry porter series'
    },
    {
      title: 'a b c',
      text: 'd e f x'
    },
    {
      title: 'a g b',
      text: 'd,f x y z x'
    }
  ];
  const invertedIndex = new InvertedIndex();
  invertedIndex.createIndex('book', book);
  const searchResults = invertedIndex.searchIndex(index, 'book', 'harry');
  res.json(searchResults);
});

app.post('/api/create', upload.array('books', 12), (req, res) => {
  const invertedIndex = new InvertedIndex();
  const files = req.files;
  const numFile = files.length;
  if (numFile === 1) {
    const newFile = JSON.parse(files[0].buffer);
    const fileTitle = files[0].originalname;
    if (InvertedIndexValidation.hasError(newFile)) {
      const errorMessage = InvertedIndexValidation.hasError(newFile);
      res.json({ error: errorMessage });
      res.end();
    }
    const singleDatabase = invertedIndex.createIndex(fileTitle, newFile);
    const addDatabase = JSON.stringify(singleDatabase);
    fs.writeFileSync('./src/routes/database.json', addDatabase);
  }
  if (numFile > 1) {
    let fileTitle = '';
    files.forEach((file) => {
      let parsedFile = JSON.parse(file.buffer);
      fileTitle = file.originalname;
      if (InvertedIndexValidation.hasError(parsedFile)) {
        const errorMessage = InvertedIndexValidation.hasError(parsedFile);
        res.json({ error: errorMessage });
        res.end();
      }
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
