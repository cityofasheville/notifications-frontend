import React from 'react';
import 'app/styles/components/SignupForm.css';

const SignupForm = () => (
  <div className="signup">

    <div className="form-section centered email">
      <label htmlFor="email-input">Email: </label>
      <input type="email" name="email"  id="email-input"/>
      <span>Already signed up?  <a href="edit">Get a link to edit your preferences</a></span>
    </div>

    <div className="form-section">
      <h2 className="centered" >Notification Categories</h2>
      <div class="notification-category">
        <h3>Large Scale Development</h3>
        {['All notifications', '28001', '28802', '28803', '28804', '28805', 'Affordable Housing'].map(d => {
          return (<div className="tag-checkbox" key={d}>
            <input type="checkbox" id={d} name={d}/>
            <label htmlFor={d}>{d}</label>
          </div>)
        })}
      </div>
      <h3>More Categories Coming Soon!</h3>
    </div>

    <div className="form-section centered">
      <button type="submit" name="Send Verification Email">Send Verification Email</button>
    </div>
  </div>
);

/*
// TODO:
* get all categories
* for each category, have an all option that checks and grays out the other boxes
* if the all option is unchecked, leave other boxes checked until user unchecks them

*/

export default SignupForm;
