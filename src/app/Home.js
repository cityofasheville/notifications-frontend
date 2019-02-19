import React from 'react';
import 'app/styles/components/Home.css';
import SignupForm from './SignupForm';

const Home = () => (
  <div>
    <h1>
      Sign up for City Notifications
    </h1>
    <p>
      How do I keep up with what's being built downtown or down the street?  What is this building going to look like?  Who is building it?
    </p>
    <p>
      This is a pilot application to let people anonymously sign up for non-emergency alerts based on city data.  Our first topic is new, large-scale development permit applications.  Use the feedback form to tell us what should be next.
    </p>
    <p>
      This application does not handle emergency alerts.  You can sign up for those with <a href="https://member.everbridge.net/index/453003085611892#/login" target="_blank" rel="noopener noreferrer">AVL Alert</a>.
    </p>
    <SignupForm/>
  </div>
);

export default Home;
