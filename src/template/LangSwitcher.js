/* **********************************************************************************************
  WARNING: DO NOT EDIT this file except from inside the react-starter-template repository. Changes made to this file inside child repos will NOT be reflected in the parent source template repository, and will generate code conflicts.
*********************************************************************************************** */
import React from 'react';
import config from 'app/config';
import { withLanguage } from 'template/LanguageContext';
import 'template/styles/components/LangSwitcher.css';

const LangSwitcher = (props) => {
  const storedLanguage = localStorage.getItem('language');
  if (storedLanguage) {
    if (storedLanguage !== props.language.language) {
      props.language.switchLanguage(
        storedLanguage,
        localStorage.getItem('languageLabel') || storedLanguage,
        false
      );
    }
  }
  const { language } = props;
  return (
    <div className="LangSwitcher-dropdown">
      <select
        onChange={(e) => {
          let language;
          let label;
          [language, label] = e.target.value.split(':');
          props.language.switchLanguage(
            language,
            label,
            false,
          );
        }}
        defaultValue={`${language.language}:${language.label}`}
      >
        {
          config.languages.map(lang => (
            <option
              key={lang.language}
              value={`${lang.language}:${lang.label}`}
            >
              {lang.label}
            </option>
          ))}
      </select>
      <div className="LangSwitcher-arrowAfter"></div>
    </div>
  );
};

export default withLanguage(LangSwitcher);
