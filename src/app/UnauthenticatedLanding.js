import React from 'react';
import config from 'app/config';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import ErrorBoundary from 'template/shared/ErrorBoundary';
import TextPuck from 'app/TextPuck';
import 'app/styles/components/UnauthenticatedLanding.scss';


const UnauthenticatedLanding = () => (
  <div id="unauthenticated-landing" className="landing">
    <h1>
      Sign up for notifications
    </h1>
    {/* eslint-disable-next-line */}
    <p id="intro">Want to keep up with what's happening downtown or down the street?  Trying to get more involved with your local government?  Sign up to receive notifications!</p>
    <ul>
      <li>
        <ErrorBoundary>
          <div className="puck-container">
            <TextPuck text="1" />
          </div>
          <div className="list-item-title">Log in or make an account</div>
          {/* eslint-disable-next-line */}
          <p><a href={config.loginURL}>Log in with Google or create an account with any email address.</a>  The information you provide <a href="/about">may be subject to public records requests</a>.</p>
        </ErrorBoundary>
      </li>
      <li>
        <ErrorBoundary>
          <div className="puck-container">
            <TextPuck text="2" />
          </div>
          <div className="list-item-title">Choose a location</div>
          <p>Enter any address in the City of Asheville&mdash;work, home, or somewhere else.</p>
        </ErrorBoundary>
      </li>
      <li>
        <ErrorBoundary>
          <div className="puck-container">
            <TextPuck text="3" />
          </div>
          <div className="list-item-title">Choose which notifications you want to get</div>
          {/* eslint-disable-next-line */}
          <p>This program is in its pilot phase.  Currently we offer notifications about newly proposed large-scale development.  <a href={config.feedbackURL} rel="noopener noreferrer" target="_blank">Tell us what we can do to improve this tool.</a></p>
        </ErrorBoundary>
      </li>
    </ul>
    {/* eslint-disable-next-line */}
    <p>Don't want to to sign up for notifications?  Learn about the development process and stay up-to-date with project information with the <a href="https://simplicity.ashevillenc.gov/development/major" target="_blank" rel="noopener noreferrer">City of Asheville Large-Scale Development Dashboard</a>.</p>
    <NoEmergencyAlertsNotice />
  </div>
);

export default UnauthenticatedLanding;
