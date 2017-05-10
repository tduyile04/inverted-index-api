'use strict';

var _invertedIndexValidation = require('../../utils/inverted-index-validation');

var _invertedIndexValidation2 = _interopRequireDefault(_invertedIndexValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      res.json({ error: 'Invalid JSON' });
      res.end();
    }
    if (_invertedIndexValidation2.default.hasSyntaxError(file)) {
      var errorMessage = _invertedIndexValidation2.default.hasSyntaxError(file);
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
        res.json({ error: 'Invalid JSON' });
        res.end();
      }
      if (_invertedIndexValidation2.default.hasSyntaxError(parsedFile)) {
        var _errorMessage = _invertedIndexValidation2.default.hasSyntaxError(parsedFile);
        res.json({ error: _errorMessage });
        res.end();
      }
    });
    next();
  }
}