/* ***************************************************************************************
  WARNING: DO NOT EDIT this file except from inside the react-starter-template repository.
  Changes made to this file inside child repos will NOT be reflected in the parent source
  template repository, and will generate code conflicts.
*************************************************************************************** */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import config from 'app/config';
import { withLanguage } from 'template/LanguageContext';
import { GET_USER_INFO } from 'template/Queries';
import Error from 'template/shared/Error';

const saveLocationThenLogin = (location) => {
  localStorage.setItem('preLoginPathname', location.pathname);
  localStorage.setItem('preLoginSearch', location.search);
  window.location = config.loginURL;
};

const getText = (loggedIn, language) => {
  if (loggedIn) {
    for (let i = 0; i < config.logoutText.translations.length; i += 1) {
      if (config.logoutText.translations[i].language === language) {
        return config.logoutText.translations[i].text;
      }
    }
    return config.logoutText.defaultText;
  }
  for (let i = 0; i < config.loginText.translations.length; i += 1) {
    if (config.loginText.translations[i].language === language) {
      return config.loginText.translations[i].text;
    }
  }
  return config.loginText.defaultText;
};

const AuthControl = (props) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const { language, location } = props;

  return (
    <Query
      query={GET_USER_INFO}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <Error message={error.message} absolutePosition />;
        if (loggedIn) {
          return (
            <a href={config.logoutURL}>{getText(true, language.language)}</a>
          );
        }
        return (
          <a
            href={config.loginURL}
            onClick={() => saveLocationThenLogin(location)}
          >
            {getText(false, language.language)}
          </a>
        );
      }}
    </Query>
  );
};

export default withRouter(withLanguage(AuthControl));
