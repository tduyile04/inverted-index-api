[![Coverage Status](https://coveralls.io/repos/github/tolupatrick004/inverted-index-api/badge.svg?branch=master)](https://coveralls.io/github/tolupatrick004/inverted-index-api?branch=master)
[![Build Status](https://travis-ci.org/tolupatrick004/inverted-index-api.svg?branch=master)](https://travis-ci.org/tolupatrick004/inverted-index-api) 
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/04c565e40be4499d8500509b262b9c16)](https://www.codacy.com/app/tolupatrick004/inverted-index-api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tolupatrick004/inverted-index-api&amp;utm_campaign=Badge_Grade)

# Inverted Index Application

## Introduction

An inverted index is an index into a set of documents of the words in the documents. The index is accessed by some search method. Each index entry gives the word and a list of documents, possibly with locations within the documents, where the word occurs. The inverted index data structure is a central component of a typical search engine indexing algorithm. A goal of a search engine implementation is to optimize the speed of the query: find the documents where word X occurs. Once a forward index is developed, which stores lists of words per document, it is next inverted to develop an inverted index.

## Features

    Create indexes from uploaded file.
    Find a particular index.
    Create index for multiple files
    Full text search of created indexes.

## Technologies

    Node.js
    Express.js
    EcmaScript 6
    Gulp (Task runner)

## Local Development

    Install npm dependencies npm install
    To run the app: gulp serve
    To run the tests run: gulp run-tests

## Contributing

    Fork this repositry to your account.
    Clone your repositry: git clone git@github.com:your-username/inverted-index.git
    Create your feature branch: git checkout -b new-feature
    Commit your changes: git commit -m "did something"
    Push to the remote branch: git push origin new-feature
    Open a pull request.