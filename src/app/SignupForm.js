import React from 'react';
import 'app/styles/components/SignupForm.css';

const SignupForm = () => (
  <div class="signup">

    <div class="form-section centered email">
      <label>Email: </label>
      <input type="email" name="email" />
      <span>Already signed up?  <a href="edit">Get a link to edit your preferences</a></span>
    </div>

    <div class="form-section">
      <h2>Notification Topics</h2>
    </div>

    <div class="form-section centered">
      <button type="submit" name="Send Verification Email">Send Verification Email</button>
    </div>
  </div>
);

export default SignupForm;
