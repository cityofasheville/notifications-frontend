import React from 'react';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import TextPuck from 'app/TextPuck';
import 'app/styles/components/UnauthenticatedLanding.scss';

const UnauthenticatedLanding = () => (
  <div id="unauthenticated-landing" className="landing">
    <h1>
      Sign up for notifications
    </h1>
    <p id="intro">Want to keep up with what's happening downtown or down the street?  Trying to get more involved with your local government?  Sign up to receive notifications!</p>
    <ul>
      <li>
        <div className="puck-container">
          <TextPuck text="1" />
        </div>
        <div className="list-item-title">Log in or make an account</div>
        <p>Log in with Google or create a new account.  Use the same or a different email address than the one you use for other city applications.  This data is kept separately to protect your privacy.</p>
      </li>
      <li>
        <div className="puck-container">
          <TextPuck text="2" />
        </div>
        <div className="list-item-title">Choose a location</div>
        <p>Enter any address in the City of Asheville-- work or home or somewhere else.</p>
      </li>
      <li>
        <div className="puck-container">
          <TextPuck text="3" />
        </div>
        <div className="list-item-title">Choose which notifications you want to get</div>
        <p>This program is in its pilot phase.  Currently we offer notifications about new, large-scale permit applications only.  Tell us about your interests or what we can do to improve this tool.</p>
      </li>
    </ul>
    <NoEmergencyAlertsNotice />
  </div>
);

export default UnauthenticatedLanding;
