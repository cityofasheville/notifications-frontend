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
              Edit notification preferences for {data.user.email}
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
          <p>Want to keep up with what's happening downtown or down the street?</p>
          <p>Currently we offer notifications about: TODO: GET CATEGORIES HERE</p>
          <ol>
            <li>Step one</li>
            <li>Step two</li>
            <li>Step three</li>
          </ol>
          <NoEmergencyAlertsNotice />
        </div>
        );
      }}
    </Query>
  );
};

export default Home;
