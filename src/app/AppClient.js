/*
Configure your apollo client in this file.
*/

import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

let NOTIFICATIONS_SERVER_URL = 'https://notify-api.ashevillenc.gov/graphql';
if (
  window.location.origin.indexOf('dev') > -1
  || process.env.USE_DEV_API === 'true'
) {
  NOTIFICATIONS_SERVER_URL = 'https://dev-notify.ashevillenc.gov/graphql';
}
if (window.location.origin.indexOf('localhost') > -1) {
  NOTIFICATIONS_SERVER_URL = 'https://dev-notify.ashevillenc.gov/graphql';
  // NOTIFICATIONS_SERVER_URL = 'http://localhost:4000/graphql';
}

const client = new ApolloClient({
  link: createHttpLink({
    uri: NOTIFICATIONS_SERVER_URL,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
});

export default client;
