import React, { useState, useEffect } from "react";
import { auth } from "./firebaseConfig";
import SignIn from "./Components/SignIn";
import Dashboard from "./Components/Dashboard";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <div>{user ? <Dashboard /> : <SignIn />}</div>;
};

export default App;
