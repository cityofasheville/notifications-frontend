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
      This application does not handle emergency alerts.  You can sign up for those with <a href="https://member.everbridge.net/index/453003085611892#/login" target="_blank" rel="noopener noreferrer">AVL Alert</a>.
    </p>
    <ol>
      <li>Make an account</li>
      <li>Choose a location</li>
      <li>Choose categories and set preferences</li>
      <li>Save preferences</li>
    </ol>
    <SignupForm/>
  </div>
);

export default Home;
