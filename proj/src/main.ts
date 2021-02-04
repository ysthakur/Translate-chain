import translate = require('@vitalets/google-translate-api');
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
  const elt = document.getElementById(divName);
  elt.innerText = sayHello(name);
}

document.getElementById('Add-language-input').onkeydown = (event: KeyboardEvent) => {
  alert(event);
};

// showHello("greeting", "TypeScript");

// type ResType = {
//   text: string,
//   from: {
//     language: {
//       iso: string
//     }
//   }
// }

interface Indexable {
  [index: string]: any
}

const languages = <Indexable> translate.languages;

// // let x = document.createElement('Start language');
// // x.setAttribute('type', 'text');
// // document.body.appendChild(x);
// // alert('foobar');
// // var button = document.createElement('button');
// // button.innerText = "Add";
// // button.innerHTML = "FOO";
// // button.onclick = function() {
// //   alert('foo');
// //   alert((<HTMLSelectElement> document.getElementById('Start language')).value);
  
// // };
// // document.body.appendChild(button);

// function completer(langStart: string) {
//   console.log("Here, finding " + langStart);
//   const res = Object.values(languages)
//     .filter((lang: any) => typeof lang === "string" && (<string> lang).toLowerCase().startsWith(langStart.toLowerCase()));
//   return [res, langStart];
// }

// // const rl = readline.createInterface({
// //   input: process.stdin,
// //   output: process.stdout,
// //   completer: completer,
// //   terminal: true
// // });

// // rl.question('Enter start language:', startLang => {
// //   console.log(`startLang=${startLang}`);
// //   /*rl.question('Enter end language:' + startLang, endLang => {
// //     console.log(startLang + ", " + endLang);
// //     rl.close();
// //   });*/
// //   rl.close();
// // });

// // translate('Ik spreek Engels', {to: 'en'}).then((_res_: any) => {
// //   let res = <ResType> _res_;
// //   console.log(res.text);
// //   //=> I speak English
// //   console.log(res.from.language.iso);
// //   //=> nl
// // }).catch((err: any) => {
// //     console.error(err);
// // });
