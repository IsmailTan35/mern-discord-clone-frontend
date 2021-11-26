
import en from 'l10n/en.json';
import tr from 'l10n/tr.json';


export const supportedLanguages = {

  'en': { data: en, name: 'English' },
  'tr': { data: tr, name: 'Türkçe' },

};
const ControlLanguage=(ln)=>{
  if(!supportedLanguages.hasOwnProperty(ln)){
    localStorage.setItem('Language',"tr")
  }
  return localStorage.getItem('Language')
}

const Languagae = (key,lang) => {
  if(key!=="LangName" ){
    return (supportedLanguages[ControlLanguage(localStorage.getItem('Language'))].data[key]);}
  else{
    return (supportedLanguages[lang].name)
  }
}
export const findStringKeys = (predicate) => {
  return Object.keys(supportedLanguages[ControlLanguage(localStorage.getItem('Language'))].data).filter(predicate);
}

export default Languagae;