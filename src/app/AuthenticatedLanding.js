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
  query getUserPreferences {
    user_preferences {
      id
      location_x
      location_y
      subscriptions {
        id
        tag {
          id
        }
        radius_miles
        whole_city
      }
    }
  }
`;

const AuthenticatedLanding = ({ userData }) => (
  <Query
    query={GET_USER_PREFERENCES}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return <div className="alert-danger">Error :(</div>;

      console.log(data)
      return (<div id="authenticated-landing" className="landing">
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
                // x={data.user_preferences ? data.user_preferences.location_x : undefined}
                // y={data.user_preferences ? data.user_preferences.location_y : undefined}
                x={35.619466}
                y={-82.556432}
              />
            </div>
          </li>
          <li>
            <div className="puck-container">
              <TextPuck text="3" />
            </div>
            <div className="step-content">
              <div className="list-item-title">Choose which notifications you want to get</div>
              <Categories userSubscriptions={data.user_preferences ? data.userPreferences.subscriptions : null} />
            </div>
          </li>
        </ul>
        <NoEmergencyAlertsNotice />
      </div>);
    }}
  </Query>
);

export default AuthenticatedLanding;
