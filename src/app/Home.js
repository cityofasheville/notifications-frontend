import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_INFO } from 'template/Queries';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import EditPreferenceForm from 'app/EditPreferenceForm';
import UnauthenticatedLanding from 'app/UnauthenticatedLanding';
import 'app/styles/components/Home.scss';

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
        return <UnauthenticatedLanding />;
      }}
    </Query>
  );
};

export default Home;
