import React from "react";
import { signInWithGoogle } from "../firebaseConfig"; // Import the Google sign-in function
import "./SignIn.css"; // Import the CSS file for styling

const SignIn = () => {
  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      console.log("Signed in as:", user.displayName);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h1>Welcome to the Journal App</h1> {/* Main Heading */}
        <p>Manage your daily journals securely and easily with personalized access.</p> {/* Description */}
        <p>Connect with me on <a href="https://www.linkedin.com/in/surya-teja-a81532223/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p> {/* LinkedIn profile */}
        
        <button className="google-sign-in" onClick={handleGoogleSignIn}>
          Sign In with Google
        </button> {/* Google Sign-in Button */}
      </div>
    </div>
  );
};

export default SignIn;
