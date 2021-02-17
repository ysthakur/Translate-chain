import * as path from 'path'
import * as tr from '@vitalets/google-translate-api'
import * as googleTranslateApi from '@vitalets/google-translate-api'
const bodyParser = require('body-parser')
const express = require('express')
const translate = require('@vitalets/google-translate-api')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, '../views'))

const allLanguageNames = <string[]> Object.values(tr.languages).filter(l => typeof l === "string")

let startLang = 'Automatic',
  endLang = '',
  middleLangs: string[] = [],
  inputText = '',
  outputText = '';

function rerender(res: any) {
  res.render('pages/index.ejs', {
    startLang: startLang,
    endLang: endLang,
    middleLangs: JSON.stringify(middleLangs),
    inputText: inputText,
    outputText: outputText,
    allLangs: JSON.stringify(allLanguageNames)
  })
}

const trans = (text: string, from: string, to: string) =>
  translate(text, { from: from, to: to }).then((res: tr.ITranslateResponse) => res.text)

// index page
app.get('/', (req: any, res: any) => {
  rerender(res)
})

app.post('/', (req: any, res: any) => {
  console.log(req.body);
  if (req.body['Action kind'] === 'Input text') {
    inputText = req.body['Input text']
    let from = startLang
    let promise = Promise.resolve(inputText)
    for (const to of middleLangs) {
      const f2 = from
      const t2 = to
      promise = promise.then(text => trans(text, f2, t2))
      from = to
    }
    promise.then(text => trans(text, from, endLang))
      .then(finalText => {
        outputText = finalText
        rerender(res)
      }).catch(e => console.error(e))
  } else {
    startLang = req.body['Start language']
    endLang = req.body['End language']
    const added = req.body['Added language']
    if (added) middleLangs.push(added)
    rerender(res)
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})