import React from 'react';
import { Query } from 'react-apollo';
import config from 'app/config';
import ErrorBoundary from 'template/shared/ErrorBoundary';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import TextPuck from 'app/TextPuck';
import Categories from 'app/Categories';
import SelectLocation from 'app/SelectLocation';
import { GET_USER_PREFERENCES } from 'app/queries';
import 'app/styles/components/AuthenticatedLanding.scss';


class AuthenticatedLanding extends React.Component {
  constructor() {
    super();
    this.state = { prefSavedShowing: false, prefSavedText: null };
    this.showPrefSaved = this.showPrefSaved.bind(this);
    this.hidePrefSaved = this.hidePrefSaved.bind(this);
  }

  showPrefSaved(text = null) {
    this.setState({ prefSavedShowing: true, prefSavedText: text });
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
                  <ErrorBoundary>
                    <div className="puck-container">
                      <TextPuck text="1" />
                    </div>
                    <fieldset className="step-content">
                      <legend className="list-item-title">Confirm email</legend>
                      {/* eslint-disable-next-line */}
                      <p>You are logged in as {this.props.userData.user.email}.  <a href={config.logoutURL}>Not you?</a></p>
                    </fieldset>
                  </ErrorBoundary>
                </li>
                <li>
                  <ErrorBoundary>
                    <div className="puck-container">
                      <TextPuck text="2" />
                    </div>
                    <fieldset className="step-content">
                      <legend className="list-item-title">Choose a location</legend>
                      {/* eslint-disable-next-line */}
                      <p>Click on the map or type to choose any address in the City of Asheville&mdash;work, home, or somewhere else.</p>
                      <SelectLocation
                        email={this.props.userData.user.email}
                        userPreference={data.user_preference}
                        onPrefSaved={this.showPrefSaved}
                      />
                    </fieldset>
                  </ErrorBoundary>
                </li>
                <li>
                  <ErrorBoundary>
                    <div className="puck-container">
                      <TextPuck text="3" />
                    </div>
                    <fieldset className="step-content">
                      <legend className="list-item-title">Choose which notifications you want to get</legend>
                      <div style={{ fontStyle: 'italic', fontSize: '0.85rem', padding: '0.15em 0' }}><a href="https://simplicity.ashevillenc.gov/development/major#types" target="_blank" rel="noopener noreferrer">Visit the large scale development dashboard</a> to learn more about what these categories mean</div>
                      <Categories
                        email={this.props.userData.user.email}
                        userPreference={data.user_preference}
                        onPrefSaved={this.showPrefSaved}
                      />
                    </fieldset>
                  </ErrorBoundary>
                </li>
                <li><div style={{ padding: '1rem', color: 'white', backgroundColor: '#0088cc', fontWeight: '700', borderRadius: '6px' }}>How did we do?  Was this form easy to use?  Got an idea that would improve it?  <a href={config.feedbackURL} target="_blank" rel="noopener noreferrer">Please give us feedback!</a></div></li>
              </ul>
              <NoEmergencyAlertsNotice />
              {this.state.prefSavedShowing && (
                <div id="pref-saved">
                  <div id="inner-content" aria-live="polite" role="region">
                    <div className="text" aria-live="polite" role="region">
                      {`Preference saved${this.state.prefSavedText ? `: ${this.state.prefSavedText}` : ''}`}
                    </div>
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
