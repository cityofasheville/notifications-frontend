/*
This file is how you configure the app in relation to the template.
Do NOT edit any files inside the TEMPLATE file in your app's repo.
Instead, you should just need to adjust the configuration settings in this file
for the template portions of your project to work as expected.
*/

const config = {
  // main configurations
  appTitle: {
    defaultText: 'Notifications',
    translations: [
      {
        language: 'en', // use ISO codes
        text: 'Notifications',
      },
    ],
  },
  appIntro: {
    defaultText: 'City of Asheville, NC',
    translations: [
      {
        language: 'en',
        text: 'City of Asheville, NC',
      },
    ],
  },
  langSwitcher: false, // Set to false if you do NOT want language translation to be enabled
  authControl: true, // Set to false if you do NOT want authentication to be enabled
  footer: true, // Set to false if you do NOT want footer to be shown
  languages: [ // languages for langSwitcher component
    {
      language: 'en',
      label: 'English',
    },
    {
      language: 'es',
      label: 'Espa\xF1ol',
    },
  ],
  menu_items: [ // main menu items -- empty this array if there should not be a menu
    {
      href: '/about',
      active: false,
      defaultText: 'About',
      external: false, // if links to external page not part of app
      translations: [
        {
          language: 'en',
          text: 'About',
        },
        {
          language: 'es',
          text: 'Acerca de',
        },
      ],
    },
  ],
  // cognito settings
  loginURL: process.env.REACT_APP_COGNITO_LOGIN, // eslint-disable-line
  logoutURL: process.env.REACT_APP_COGNITO_LOGOUT, // eslint-disable-line
  redirect_uri: process.env.REACT_APP_REDIRECT_URI, // eslint-disable-line
  loginText: {
    defaultText: 'Log in',
    translations: [
      {
        language: 'en',
        text: 'Log in',
      },
      {
        language: 'es',
        text: 'Iniciar sesi\xF3n',
      },
    ],
  },
  logoutText: {
    defaultText: 'Log out',
    translations: [
      {
        language: 'en',
        text: 'Log out',
      },
      {
        language: 'es',
        text: 'Cerrar sesi\xF3n',
      },
    ],
  },
  // footer
  hasFeedbackForm: false,
  feedbackURL: '', // eslint-disable-line
  hasGitHubURL: true,
  gitHubURL: 'https://github.com/cityofasheville/notifications-frontend',

};

export default config;
