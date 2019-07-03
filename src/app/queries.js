import gql from 'graphql-tag';


export const GET_USER_PREFERENCES = gql`
  query getUserPreference($email: String!) {
    user_preference(email: $email) {
      id
      location_x
      location_y
      send_types {
        type
        email
      }
      subscriptions {
        id
        radius_miles
        whole_city
      }
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  query categories {
    categories {
      name
      id
      tags {
        id
        name
      }
    }
  }
`;

export const ADDRESS_SEARCH_QUERY = gql`
  query search($searchString: String!) {
    search(searchString: $searchString, searchContexts: ["address"]) {
      type
      results {
        type
        ...on AddressResult {
          type
          address
        }
      }
    }
  }
`;
