import React from 'react';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';

const aboutMessage = 'This new application allows you to sign up for non-emergency notifications.  The pilot topic is large scale development.  If you have ideas about what you\'d like to see next, use our feedback form.';

const About = () => (
  <div>
    <h1>About</h1>
    <p>
      {aboutMessage}
    </p>
    <NoEmergencyAlertsNotice />
  </div>
);

export default About;
