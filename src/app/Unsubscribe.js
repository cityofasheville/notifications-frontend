import React from 'react';
import { Mutation } from 'react-apollo';
import { DELETE_USER_PREFERENCE } from 'app/mutations';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';

class DoMutation extends React.Component {
  // Trigger a mutation as soon as a user lands on the page rather than making them click something
  componentDidMount() {
    const { mutate } = this.props;
    mutate();
  }

  render() {
    return null;
  }
}

const Unsubscribe = () => (
  <Mutation
    mutation={DELETE_USER_PREFERENCE}
    variables={{ url: window.location.href }}
  >
    {(deleteUserPreference, { loading, error, data }) => {
      if (loading) return <div>Loading...</div>;
      if (error) return <div className="alert-danger">Error :(</div>;
      return (
        <div className="landing">
          <DoMutation mutate={deleteUserPreference} />
          <h1>
            Unsubscribed
          </h1>
          <p>You have unsubscribed from all notifications.  Log in to change preferences.</p>
          <NoEmergencyAlertsNotice />
        </div>
      );
    }}
  </Mutation>
);

export default Unsubscribe;
