import React from 'react';


const NoEmergencyAlertsNotice = () => (
  <p className="alert-danger" style={{ textAlign: 'center' }}>
    {/* eslint-disable-next-line */}
    This application does not handle emergency alerts.  Sign up for those with <a href="https://member.everbridge.net/index/453003085611892#/login" target="_blank" rel="noopener noreferrer">AVL Alert</a>.
  </p>
);

export default NoEmergencyAlertsNotice;
