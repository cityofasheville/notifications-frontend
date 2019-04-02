import React from 'react';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';
import TextPuck from 'app/TextPuck'
import 'app/styles/components/AuthenticatedLanding.scss';

const AuthenticatedLanding = ({ data }) => (
  <div id="authenticated-landing" className="landing">
    <h1>
      Set notification preferences
    </h1>
    <ul>
      <li>
        <div className="puck-container">
          <TextPuck text="1" />
        </div>
        <div className="step-content">
          <div className="list-item-title">Confirm email</div>
          <p>You are logged in as {data.user.email}.  Not you?</p>
        </div>
      </li>
      <li>
        <div className="puck-container">
          <TextPuck text="2" />
        </div>
        <div className="step-content">
          <div className="list-item-title">Choose a location</div>
          <p>Enter any address in the City of Asheville-- work or home or somewhere else.</p>
        </div>
      </li>
      <li>
        <div className="puck-container">
          <TextPuck text="3" />
        </div>
        <div className="step-content">
          <div className="list-item-title">Choose which notifications you want to get</div>
          <p>This program is in its pilot phase.  Currently we offer notifications about new, large-scale permit applications only.  Tell us about your interests or what we can do to improve this tool.</p>
        </div>
      </li>
    </ul>
    <NoEmergencyAlertsNotice />
  </div>
);

export default AuthenticatedLanding;
