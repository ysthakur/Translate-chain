import * as googleTranslateApi from '@vitalets/google-translate-api';
import * as path from 'path';
const bodyParser = require('body-parser');
const express = require('express');
const tr = require('@vitalets/google-translate-api');
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '../views'))

// app.get('/', (req: any, res: any) => {
//   res.send('Hello World!')
// })

const allLanguageNames = <string[]> Object.values(googleTranslateApi.languages).filter(l => typeof l === "string");

let startLang = 'auto',
  endLang = 'en',
  middleLangs: string[] = [],
  middleLangNames: string[] = [],
  inputText = "",
  outputText = "";

function rerender(res: any) {
  res.render('pages/index.ejs', {
    startLang: tr.languages[startLang],
    endLang: tr.languages[endLang],
    middleLangs: JSON.stringify(middleLangNames),
    inputText: inputText,
    outputText: outputText,
    allLangs: JSON.stringify(allLanguageNames)
  })
}

function translate(text: string, from: string, to: string): Promise<string> {
  return tr(text, { from: from, to: to }).then((res: googleTranslateApi.ITranslateResponse) => {
      // console.log(res);
      return res.text
    })
}

// index page
app.get('/', (req: any, res: any) => {
  rerender(res);
});

app.post('/', (req: any, res: any) => {
  // res.sendStatus(200);
  // console.log('Got body:', req.body);
  if (req.body['Action kind'] === 'Input text') {
    inputText = req.body['Input text'];
    let from = startLang;
    let promise = Promise.resolve(inputText);
    for (const to of middleLangs) {
      const f2 = from;
      const t2 = to;
      // console.log(`from=${from}, to=${to}`);
      promise = promise.then(text => translate(text, f2, t2));
      from = to;
    }
    promise.then(text => translate(text, from, endLang))
      .then(finalText => {
        outputText = finalText;
        rerender(res);
      }).catch(e => console.error(e));
  } else {
    startLang = tr.languages.getCode(req.body['Start language']);
    endLang = tr.languages.getCode(req.body['End language']);
    const added = req.body['Added language'];
    if (added) {
      middleLangs.push(tr.languages.getCode(added));
      middleLangNames.push(added);
    }
    rerender(res);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});