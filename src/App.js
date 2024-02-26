import React from "react";
import firebase from "./firebase";
import { RecaptchaVerifier } from "firebase/auth";
import 'firebase/auth';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: "",
      otp: ""
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  configureCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        this.onSignInSubmit(); // Call the function here
        console.log("Recaptcha verified");
      },
      defaultCountry: 'IN'
    });
  }

  onSignInSubmit = (e) => {
    e.preventDefault();
    this.configureCaptcha();
    const phoneNumber = "+91" + this.state.mobile;
    console.log(phoneNumber);

    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("OTP has been sent");
      }).catch((error) => {
        console.log("SMS not sent");
      });
  }

  onSubmitOtp = (e) => {
    e.preventDefault();
    const code = this.state.otp;
    console.log(code);
    window.confirmationResult.confirm(code).then((result) => {
      const user = result.user;
      console.log(JSON.stringify(user));
      alert("User is verified");
    }).catch((error) => {
      console.log("User couldn't sign in (bad verification code?)");
    });
  }

  render() {
    return (
      <div>
        <h2>Login Form</h2>
        <form onSubmit={this.onSignInSubmit}>
          <div id="sign-in-button"></div>
          <input type='number' name='mobile' placeholder="Mobile Number" required onChange={this.handleChange} />
          <button type="submit">Submit</button>
        </form>
        <h2>Enter OTP</h2>
        <form onSubmit={this.onSubmitOtp}>
          <input type='number' name='otp' placeholder="OTP CODE" required onChange={this.handleChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

export default App;
