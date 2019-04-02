import React from 'react';
import { Query } from 'react-apollo';
import { GET_USER_INFO } from 'template/Queries';
import SignupForm from './SignupForm';
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
            <p>
              This application does not handle emergency alerts.  You can sign up for those with <a href="https://member.everbridge.net/index/453003085611892#/login" target="_blank" rel="noopener noreferrer">AVL Alert</a>.
            </p>
            <SignupForm/>
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
          <p>
            This application does not handle emergency alerts.  You can sign up for those with <a href="https://member.everbridge.net/index/453003085611892#/login" target="_blank" rel="noopener noreferrer">AVL Alert</a>.
          </p>
        </div>
        );
      }}
    </Query>
  );
};

export default Home;
