import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';


let SIMPLICITY_SERVER_URL = 'https://data-api1.ashevillenc.gov/graphql';
if (window.location.origin.indexOf('dev') > -1
    || process.env.USE_DEV_API === 'true'
    || window.location.origin.indexOf('localhost') > -1) {
  //SIMPLICITY_SERVER_URL = 'https://dev-data-api1.ashevillenc.gov/graphql';
  SIMPLICITY_SERVER_URL = 'simplicityapi-alb-jobs-294934993.us-east-1.elb.amazonaws.com:4000/graphql';
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
