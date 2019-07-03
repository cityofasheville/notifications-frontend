import gql from 'graphql-tag';

export const CREATE_USER_PREFERENCE = gql`
  mutation createUserPreference(
    $user_preference: UserPreferenceInput!,
  ) {
    createUserPreference(
      user_preference: $user_preference,
    ) {
      location_x
      location_y
      send_types {
        type
        email
      }
      subscriptions {
        tag {
          id
        }
        radius_miles
        whole_city
      }
    }
  }
`;

export const UPDATE_USER_PREFERENCE = gql`
  mutation updateUserPreference(
    $user_preference: UserPreferenceInput!,
  ) {
    updateUserPreference(
      user_preference: $user_preference,
    ) {
      location_x
      location_y
      send_types {
        type
        email
      }
      subscriptions {
        tag {
          id
        }
        radius_miles
        whole_city
      }
    }
  }
`;
