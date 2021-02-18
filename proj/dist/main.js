"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var path = _interopRequireWildcard(require("path"));

var tr = _interopRequireWildcard(require("@vitalets/google-translate-api"));

var bodyParser = _interopRequireWildcard(require("body-parser"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

// import * as express from "express";
var express = require('express');

var translate = require('@vitalets/google-translate-api');

var app = express();
var port = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'));
var allLangsButAuto = JSON.stringify(Object.values(tr.languages).filter(function (l) {
  return typeof l === "string" && l != "Automatic";
}));

function trans(text, from, to) {
  // return translate(text, { from: from, to: to }).then((res: tr.ITranslateResponse) => res.text)
  return translate(text, {
    from: from,
    to: to
  }).then(function (res) {
    return res.text;
  });
} // index page


app.get('/', function (req, res) {
  return res.render('pages/index.ejs', {
    startLang: 'Automatic',
    endLang: '',
    middleLangs: '[]',
    inputText: '',
    outputText: '',
    allButAuto: allLangsButAuto
  });
});
app.post('/', function (req, res) {
  var startLang = req.body['Start language'],
      endLang = req.body['End language'],
      middleLangs = eval(req.body['Middle languages']),
      inputText = req.body['Input text'],
      outputText = req.body['Output text'],
      actionKind = req.body['Action kind'];

  var rerender = function rerender() {
    return res.render('pages/index.ejs', {
      startLang: startLang,
      endLang: endLang,
      middleLangs: JSON.stringify(middleLangs),
      inputText: inputText,
      outputText: outputText,
      allButAuto: allLangsButAuto
    });
  };

  if (actionKind === 'Input text') {
    var from = startLang;
    var promise = Promise.resolve(inputText);

    var _iterator = _createForOfIteratorHelper(middleLangs),
        _step;

    try {
      var _loop = function _loop() {
        var to = _step.value;
        var f2 = from;
        var t2 = to;
        promise = promise.then(function (text) {
          return trans(text, f2, t2);
        });
        from = to;
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    promise.then(function (text) {
      return trans(text, from, endLang);
    }).then(function (finalText) {
      outputText = finalText;
      rerender();
    })["catch"](function (e) {
      return console.error(e);
    });
  } else {
    rerender();
  }
});
app.listen(port, function () {
  console.log("Listening at http://localhost:".concat(port));
});