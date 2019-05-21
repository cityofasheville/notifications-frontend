import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import config from 'app/config';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import TextPuck from 'app/TextPuck';
import Categories from 'app/Categories';
import SelectLocation from 'app/SelectLocation';
import 'app/styles/components/AuthenticatedLanding.scss';

const GET_USER_PREFERENCES = gql`
  query getUserPreference($email: String!) {
    user_preference(email: $email) {
      id
      location_x
      location_y
      subscriptions {
        id
        radius_miles
        whole_city
      }
    }
  }
`;

const AuthenticatedLanding = ({ userData }) => (
  <Query
    query={GET_USER_PREFERENCES}
    variables={{ email: userData.user.email }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div className="alert-danger">Error :(</div>;
console.log(data)
      return (
        <div id="authenticated-landing" className="landing">
          <h1>
            Set notification preferences
          </h1>
          <ul>
            <li>
              <div className="puck-container">
                <TextPuck text="1" />
              </div>
              <div className="step-content">
                <div className="list-item-title">Confirm email</div>
                <p>You are logged in as {userData.user.email}.  <a href={config.logoutURL}>Not you?</a></p>
              </div>
            </li>
            <li>
              <div className="puck-container">
                <TextPuck text="2" />
              </div>
              <div className="step-content">
                <div className="list-item-title">Choose a location</div>
                <p>Click on the map or type to choose any address in the City of Asheville-- work, home, or somewhere else.</p>
                <SelectLocation
                  x={data.user_preference ? data.user_preference.location_x : undefined}
                  y={data.user_preference ? data.user_preference.location_y : undefined}
                />
              </div>
            </li>
            <li>
              <div className="puck-container">
                <TextPuck text="3" />
              </div>
              <div className="step-content">
                <div className="list-item-title">Choose which notifications you want to get</div>
                <Categories userSubscriptions={data && data.user_preference ? data.user_preference.subscriptions : null} />
              </div>
            </li>
          </ul>
          <NoEmergencyAlertsNotice />
        </div>
      );
    }}
  </Query>
);

export default AuthenticatedLanding;
