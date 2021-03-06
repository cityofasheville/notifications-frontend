import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_INFO } from 'template/Queries';
import UnauthenticatedLanding from 'app/UnauthenticatedLanding';
import AuthenticatedLanding from 'app/AuthenticatedLanding';
import 'app/styles/components/Home.scss';


const Home = ({ history }) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  return (
    <Query
      query={GET_USER_INFO}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return <div className="alert-danger">Login Unavailable</div>;
        if (loggedIn && data && data.user && data.user.email) {
          return <AuthenticatedLanding email={data.user.email} />;
        }
        if (loggedIn) {
          // If it's logged in but there's no email address, set it to false
          localStorage.setItem('loggedIn', false);
          history.push('/');
        }
        return <UnauthenticatedLanding />;
      }}
    </Query>
  );
};

export default Home;
