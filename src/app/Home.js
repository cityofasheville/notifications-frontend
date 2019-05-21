import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_INFO } from 'template/Queries';
import UnauthenticatedLanding from 'app/UnauthenticatedLanding';
import AuthenticatedLanding from 'app/AuthenticatedLanding';
import 'app/styles/components/Home.scss';

const Home = () => {
  let loggedIn = localStorage.getItem('loggedIn') === 'true';
  return (
    <Query
      query={GET_USER_INFO}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <div className="alert-danger">Login Unavailable</div>;
        // TODO: REDIRECT? MAKE IT SO THAT IT DOESN'T SAY "LOG OUT" IN CORNER
        loggedIn = loggedIn && data.user.email;
        if (loggedIn) {
          return <AuthenticatedLanding userData={data} />;
        }
        return <UnauthenticatedLanding />;
      }}
    </Query>
  );
};

export default Home;
