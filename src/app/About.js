import React from 'react';
import config from 'app/config';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';


const About = () => (
  <div>
    <h1>About</h1>
    <p>
      This new application allows you to sign up for non-emergency notifications.  The pilot topic is large scale development.  If you have ideas about what you would like to see next, <a href={config.feedbackURL} target="_blank" rel="noopener noreferrer">use the feedback form to tell us</a>.</p>
    <NoEmergencyAlertsNotice />
  </div>
);

export default About;
