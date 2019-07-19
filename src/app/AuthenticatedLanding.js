import React from 'react';
import { Query } from 'react-apollo';
import config from 'app/config';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import TextPuck from 'app/TextPuck';
import Categories from 'app/Categories';
import SelectLocation from 'app/SelectLocation';
import { GET_USER_PREFERENCES } from 'app/queries';
import 'app/styles/components/AuthenticatedLanding.scss';


// TODO: MAKE THIS STATEFUL SO THAT PREF SAVED CAN SHOW/LEAVE

class AuthenticatedLanding extends React.Component {
  constructor() {
    super();
    this.state = { prefSavedShowing: false };
    this.showPrefSaved = this.showPrefSaved.bind(this);
    this.hidePrefSaved = this.hidePrefSaved.bind(this);
  }

  showPrefSaved() {
    this.setState({ prefSavedShowing: true });
  }

  hidePrefSaved() {
    this.setState({ prefSavedShowing: false });
  }

  render() {
    return (
      <Query
        query={GET_USER_PREFERENCES}
        variables={{ email: this.props.userData.user.email }}
        fetchPolicy="network-only"
      >
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div className="alert-danger">Error :(</div>;
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
                    {/* eslint-disable-next-line */}
                    <p>You are logged in as {this.props.userData.user.email}.  <a href={config.logoutURL}>Not you?</a></p>
                  </div>
                </li>
                <li>
                  <div className="puck-container">
                    <TextPuck text="2" />
                  </div>
                  <div className="step-content">
                    <div className="list-item-title">Choose a location</div>
                    {/* eslint-disable-next-line */}
                    <p>Click on the map or type to choose any address in the City of Asheville-- work, home, or somewhere else.</p>
                    <SelectLocation
                      email={this.props.userData.user.email}
                      userPreference={data.user_preference}
                      onPrefSaved={this.showPrefSaved}
                    />
                  </div>
                </li>
                <li>
                  <div className="puck-container">
                    <TextPuck text="3" />
                  </div>
                  <div className="step-content">
                    <div className="list-item-title">Choose which notifications you want to get</div>
                    <Categories
                      email={this.props.userData.user.email}
                      userPreference={data.user_preference}
                      onPrefSaved={this.showPrefSaved}
                    />
                  </div>
                </li>
              </ul>
              <NoEmergencyAlertsNotice />
              {this.state.prefSavedShowing && (
                <div id="pref-saved">
                  <div className="text" aria-live="polite" role="region">
                    Preference saved
                    <button className="close" type="button" onClick={this.hidePrefSaved}>&#10006;</button>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default AuthenticatedLanding;
