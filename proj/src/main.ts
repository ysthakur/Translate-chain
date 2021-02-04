import translate = require('@vitalets/google-translate-api');

type ResType = {
  text: string,
  from: {
    language: {
      iso: string
    }
  }
}

interface StringIndices {
  [index: string]: any
}

const languages = <StringIndices> translate.languages;

let startLang: string | null = null;
let endLang: string | null = null;
let middleLangs: string[] = [];

const startLanguageBox = <HTMLInputElement> document.getElementById('Start language input');
const endLanguageBox = <HTMLInputElement> document.getElementById('End language input');
const addLanguageBox = <HTMLInputElement> document.getElementById('Add-language-input');

startLanguageBox.onkeydown = (event: KeyboardEvent) => {
  if (event.key == 'Enter') {
    startLang = startLanguageBox.value;
    console.log(startLang);
  }
};

endLanguageBox.onkeydown = (event: KeyboardEvent) => {
  if (event.key == 'Enter') {
    endLang = endLanguageBox.value;
    console.log(endLang);
  }
};

addLanguageBox.onkeydown = (event: KeyboardEvent) => {
  if (event.key == 'Enter') {
    middleLangs.push(addLanguageBox.value);
    console.log(middleLangs);
  }
};

translate('Ik spreek Engels', {to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch(err => {
    console.error(err);
});
