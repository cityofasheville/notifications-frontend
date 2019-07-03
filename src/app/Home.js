import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_INFO } from 'template/Queries';
import UnauthenticatedLanding from 'app/UnauthenticatedLanding';
import AuthenticatedLanding from 'app/AuthenticatedLanding';
import 'app/styles/components/Home.scss';

const Home = ({ history }) => {
  let loggedIn = localStorage.getItem('loggedIn') === 'true';
  return (
    <Query
      query={GET_USER_INFO}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <div className="alert-danger">Login Unavailable</div>;
        loggedIn = loggedIn && data.user.email;
        if (loggedIn && data.user.email) {
          return <AuthenticatedLanding userData={data} />;
        } else if (loggedIn) {
          // Solve issue that is maybe only caused by server restarting?
          localStorage.setItem('loggedIn', false);
          history.push('/');
        }
        return <UnauthenticatedLanding />;
      }}
    </Query>
  );
};

export default Home;
