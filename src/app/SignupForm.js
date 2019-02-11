import React from 'react';
import 'app/styles/components/SignupForm.css';

const SignupForm = () => (
  <div class="signup">

    <div class="form-section centered">
      <label>Email: </label>
      <input type="email" name="email" />
    </div>

    <div class="form-section centered">
      <button type="submit" name="Send Verification Email">Send Verification Email</button>
    </div>
  </div>
);

export default SignupForm;
