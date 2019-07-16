/*
Configure your apollo client in this file.
https://github.com/peaonunes/apollo-multiple-clients-example/blob/master/src/App.js
*/

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

let SIMPLICITY_SERVER_URL = 'https://data-api1.ashevillenc.gov/graphql';
if (window.location.origin.indexOf('dev') > -1
    || process.env.USE_DEV_API === 'true'
    || window.location.origin.indexOf('localhost') > -1) {
  SIMPLICITY_SERVER_URL = 'https://dev-data-api1.ashevillenc.gov/graphql';
}
if (process.env.USE_LOCAL_API === 'true') {
  SIMPLICITY_SERVER_URL = 'http://localhost:8080/graphql';
}

const simpliCityClient = new ApolloClient({
  link: createHttpLink({
    uri: SIMPLICITY_SERVER_URL,
    // credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default simpliCityClient;


// import fetch from 'unfetch';
// import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
// import { ApolloLink } from 'apollo-link';
// import { withClientState } from 'apollo-link-state';
// import { setContext } from 'apollo-link-context';
// import { resolvers } from './resolvers';
// import { defaultState } from './defaultState';
// import { fragmentTypes } from './fragmentTypes';

// const httpLink = createHttpLink({ uri: SERVER_URL, fetch });

// const authLink = setContext(
//   request =>
//     new Promise((success, fail) => {
//       const signedInUser = firebase.auth().currentUser;
//       if (signedInUser) {
//         signedInUser.getIdToken(true)
//         .then((idToken) => {
//           localStorage.setItem('token', idToken);
//           success({ headers: {
//             authorization: idToken,
//           } });
//           fail(Error(request.statusText));
//         });
//       } else {
//         success({ headers: {
//           authorization: localStorage.getItem('token') || null,
//         } });
//         fail(Error(request.statusText));
//       }
//     })
// );

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData: fragmentTypes,
// });
//
// const cache = new InMemoryCache({ fragmentMatcher });
//
// const stateLink = withClientState({
//   cache,
//   defaults: defaultState,
//   resolvers,
// });
//
// const aClient = new ApolloClient({
//   link: ApolloLink.from([
//     stateLink,
//     authLink,
//     httpLink,
//   ]),
//   cache,
// });
//
// aClient.onResetStore(stateLink.writeDefaults);
//
// export const client = aClient;
