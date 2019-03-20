import React from 'react';
import { Link } from 'react-router-dom';
import config from 'app/config';
import { withLanguage } from 'template/LanguageContext';
import logo from 'template/assets/logo.svg';
import 'template/styles/components/AppTitle.css';

const AppTitle = (props) => {
  let appTitle = config.appTitle.defaultText;
  for (let i = 0; i < config.appTitle.translations.length; i += 1) {
    if (config.appTitle.translations[i].language === props.language.language) {
      appTitle = config.appTitle.translations[i].text;
    }
  }
  let appIntro = config.appIntro.defaultText;
  for (let i = 0; i < config.appIntro.translations.length; i += 1) {
    if (config.appIntro.translations[i].language === props.language.language) {
      appIntro = config.appIntro.translations[i].text;
    }
  }

  return (
    <Link to="/" className="AppTitle-wrapper-link">
      <img className="AppTitle-logo" src={logo} alt="City of Asheville logo"></img>
      <div className="AppTitle-title-container">
        <h1 className="AppTitle-title">{appTitle}</h1>
        <div className="AppTitle-intro">{appIntro}</div>
      </div>
    </Link>
  );
};

export default withLanguage(AppTitle);
