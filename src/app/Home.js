import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_INFO } from 'template/Queries';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import EditPreferenceForm from 'app/EditPreferenceForm';
import 'app/styles/components/Home.css';

const Home = () => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  return (
    <Query
      query={GET_USER_INFO}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <a href="#" className="alert-danger">Login Unavailable</a>;
        if (loggedIn) {
          return (<div>
            <h1>
              Set notification preferences for {data.user.email}
            </h1>
            <EditPreferenceForm/>
            <NoEmergencyAlertsNotice />
          </div>
          );
        }
        return (<div>
          <h1>
            Sign up for notifications
          </h1>
          <p>Want to keep up with what's happening downtown or down the street?  Thinking about getting more involved with your local government?</p>
          <p>Sign up to receive notifications!</p>
          <ol>
            <li>Step one</li>
            <li>Step two</li>
            <li>Step three</li>
          </ol>
          <p>This is a brand new application that is currently in pilot phase.  Currently we offer notifications about: TODO: GET CATEGORIES HERE.  Tell us about your interests or what we can do to improve this tool.</p>
          <NoEmergencyAlertsNotice />
        </div>
        );
      }}
    </Query>
  );
};

export default Home;
