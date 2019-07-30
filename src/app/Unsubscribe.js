import React from 'react';
import { Mutation } from 'react-apollo';
import { DELETE_USER_PREFERENCE } from 'app/mutations';
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

class Unsubscribe  extends React.Component {
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

          const deletedEmail = data && data.deleteUserPreferenceSecure ? data.deleteUserPreferenceSecure.deletedEmail : null;

          return (
            <div className="landing">
              {!this.state.unsubscribeMutationSent && <DoMutation mutate={deleteUserPreference} onFinish={this.updateUnsubscribed} />}
              {!this.state.unsubscribeMutationSent && <div>Unsubscribing...</div>}
              {this.state.unsubscribeMutationSent && (
                <React.Fragment>
                  <h1>
                    Unsubscribed
                  </h1>
                  <p>{`You have unsubscribed ${deletedEmail ?  `${deletedEmail} ` : ''}from all notifications.  Log in to change preferences.`}</p>
                  <NoEmergencyAlertsNotice />
                </React.Fragment>
              )}
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default Unsubscribe;
