import React from 'react';
import config from 'app/config';
import NoEmergencyAlertsNotice from 'app/NoEmergencyAlertsNotice';


const About = () => (
  <div>
    <h1>About</h1>
    {/* eslint-disable-next-line */}
    <p>This new application allows you to sign up for non-emergency notifications.  The pilot topic is large-scale development.  If you have ideas about what you would like to see next, <a href={config.feedbackURL} target="_blank" rel="noopener noreferrer">use the feedback form to tell us</a>.</p>
    {/* eslint-disable-next-line */}
    <p>Please be advised that any information provided through this website may be subject to the North Carolina Public Records Act (Chapter 132 NC General Statutes) and, upon request, provided to requesters.  To help protect your privacy, we have not tied this website's database to any other city database.  You may use any email address and any location (i.e., not necessarily your home address) to select which notifications you want to receive.</p>
    {/* eslint-disable-next-line */}
    <p>Don't want to to sign up for notifications?  Learn about the development process and stay up-to-date with project information with the <a href="https://simplicity.ashevillenc.gov/development/major" target="_blank" rel="noopener noreferrer">City of Asheville Large-Scale Development Dashboard</a>.</p>
    <NoEmergencyAlertsNotice />
  </div>
);

export default About;
