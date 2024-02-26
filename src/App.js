import React, {useEffect, useState} from "react";
import {auth, dbRef} from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import {getDatabase, ref} from "firebase/database";
import { set } from 'firebase/database';

function App() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    configureCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else if (name === 'otp') {
      setOtp(value);
    }
  }

  const configureCaptcha = () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
        'size': 'invisible',
      });
    } catch (error) {
      console.error("Failed to configure Recaptcha", error);
    }
  }

  const onSignInSubmit = (e) => {
    e.preventDefault();
    const phoneNumber = "+91" + mobile;
    console.log(phoneNumber);

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          console.log("OTP has been sent");
        }).catch((error) => {
      console.log("SMS not sent");
    });
  }

  const onSubmitOtp = (e) => {
    e.preventDefault();
    const code = otp;
    console.log(code);
    window.confirmationResult.confirm(code).then((result) => {
      const user = result.user;
      console.log(JSON.stringify(user));
      alert("User is verified");

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          // Success callback
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          // Store in Firebase
          const db = getDatabase();
          const locationRef = ref(db, 'location/' + user.uid);

          set(locationRef, {
            latitude: latitude,
            longitude: longitude
          }).then(() => {
            console.log("Location saved in database");
          }).catch((error) => {
            console.error("Failed to save location in database", error);
          });

        }, (error) => {
          // Error callback
          console.error("Failed to get geolocation", error);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

    }).catch((error) => {
      console.log("User couldn't sign in (bad verification code?)");
    });
  }

  return (
      <div>
        <h2>Login Form</h2>
        <form onSubmit={onSignInSubmit}>
          <div id="sign-in-button"></div>
          <input type='number' name='mobile' placeholder="Mobile Number" required onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
        <h2>Enter OTP</h2>
        <form onSubmit={onSubmitOtp}>
          <input type='number' name='otp' placeholder="OTP CODE" required onChange={handleChange} />
          <button type="submit">Submit</button>
        </form>
      </div>
  )
}

export default App;
