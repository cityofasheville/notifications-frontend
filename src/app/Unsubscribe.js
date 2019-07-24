import React from 'react';
import { Mutation } from 'react-apollo';
import { DELETE_USER_PREFERENCE } from 'app/mutations';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';

class DoMutation extends React.Component {
  componentDidMount() {
    const { mutate } = this.props;
    mutate();
  }

  render() {
    return null;
  }
}

const Unsubscribe = ({ location }) => (
  <Mutation
    mutation={DELETE_USER_PREFERENCE}
    variables={{ url: `${location.pathname}${location.search}` }}
  >
    {(deleteUserPreference, data) => {
      return (
        <div id="unauthenticated-landing" className="landing">
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
