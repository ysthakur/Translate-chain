import * as path from 'path'
import * as tr from '@vitalets/google-translate-api'
import * as bodyParser from 'body-parser'
// import * as express from "express";
const express = require('express')
const translate = require('@vitalets/google-translate-api')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.set('views', path.join(__dirname, '../views'))

const allLanguageNames = JSON.stringify(Object.values(tr.languages).filter(l => typeof l === "string"))
const allLangsButAuto = JSON.stringify(Object.values(tr.languages).filter(l => typeof l === "string" && l != "Automatic"))

function trans(text: string, from: string, to: string) {
  // return translate(text, { from: from, to: to }).then((res: tr.ITranslateResponse) => res.text)
  return translate(text, { from: from, to: to }).then((res: tr.ITranslateResponse) => res.text)
}
console.log(JSON.stringify([]));
console.log(JSON.stringify(['foo', 'bar']));
// index page
app.get('/', (req: any, res: any) =>
  res.render('pages/index.ejs', {
    startLang: 'Automatic',
    endLang: '',
    middleLangs: '[]',
    inputText: '',
    outputText: '',
    allLangs: allLanguageNames,
    allButAuto: allLangsButAuto
  })
)

app.post('/', (req: any, res: any) => {
  console.log(req.body);
  
  let startLang = req.body['Start language'],
    endLang = req.body['End language'],
    middleLangs: string[] = eval(req.body['Middle languages']),
    inputText = req.body['Input text'],
    outputText = req.body['Output text'],
    actionKind = req.body['Action kind'];

  console.log(`MiddleLangs=${middleLangs} -from- ${req.body['Middle languages']}`)

  let rerender = () =>
    res.render('pages/index.ejs', {
      startLang: startLang,
      endLang: endLang,
      middleLangs: JSON.stringify(middleLangs),
      inputText: inputText,
      outputText: outputText,
      allLangs: allLanguageNames,
      allButAuto: allLangsButAuto
    })

  if (actionKind === 'Input text') {
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
        rerender()
      }).catch(e => console.error(e))
  } else {
    console.log({
      startLang: startLang,
      endLang: endLang,
      middleLangs: JSON.stringify(middleLangs),
      inputText: inputText,
      outputText: outputText
    })
    rerender()
  }
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})