import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { DELETE_USER_PREFERENCE } from 'app/mutations';
import ErrorBoundary from 'template/shared/ErrorBoundary';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';


class DoMutation extends React.Component {
  // Trigger a mutation as soon as a user lands on the page rather than making them click something
  componentDidMount() {
    const { mutate, onFinish } = this.props;
    mutate();
    onFinish();
  }

  render() {
    return null;
  }
}

DoMutation.propTypes = {
  mutate: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
};


class Unsubscribe extends React.Component {
  constructor() {
    super();
    this.state = {
      unsubscribeMutationSent: false,
    };
    this.updateUnsubscribed = this.updateUnsubscribed.bind(this);
  }

  updateUnsubscribed() {
    this.setState({ unsubscribeMutationSent: true });
  }

  render() {
    return (
      <Mutation
        mutation={DELETE_USER_PREFERENCE}
        variables={{ url: window.location.href }}
      >
        {(deleteUserPreference, { loading, error, data }) => {
          if (loading) return <div>Loading...</div>;

          if (error || (data && data.deleteUserPreferenceSecure && data.deleteUserPreferenceSecure.error)) return <div className="alert-danger">Error :(</div>;

          const deletedEmail = data && data.deleteUserPreferenceSecure
            ? data.deleteUserPreferenceSecure.deletedEmail : null;
          const { unsubscribeMutationSent } = this.state;
          return (
            <ErrorBoundary>
              <div className="landing">
                {!unsubscribeMutationSent && (
                  <DoMutation mutate={deleteUserPreference} onFinish={this.updateUnsubscribed} />
                )}
                {!unsubscribeMutationSent && <div>Unsubscribing...</div>}
                {unsubscribeMutationSent && (
                  <React.Fragment>
                    <h1>
                      Unsubscribed
                    </h1>
                    <p>{`You have unsubscribed ${deletedEmail ? `${deletedEmail} ` : ''}from all notifications.  Log in to change preferences.`}</p>
                    <NoEmergencyAlertsNotice />
                  </React.Fragment>
                )}
              </div>
            </ErrorBoundary>
          );
        }}
      </Mutation>
    );
  }
}

export default Unsubscribe;
