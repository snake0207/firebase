import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Profile from "routes/Profile";
import React, { useEffect, useState } from "react";
import { authService } from "fbase";
import Navigation from "./Navigation";

function App() {
  const [init, setInit] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setUserObj(user);
      } else {
        setLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const changeProfile = () => {
    setUserObj(Object.assign({}, authService.currentUser));
  };

  return (
    <React.Fragment>
      {!init ? (
        "Initializing..."
      ) : (
        <Router>
          {loggedIn && <Navigation userObj={userObj} />}
          <Routes>
            <Route
              exact
              path="/"
              element={loggedIn ? <Home userObj={userObj} /> : <Auth />}
            ></Route>
            <Route
              exact
              path="/profile"
              element={<Profile userObj={userObj} action={changeProfile} />}
            ></Route>
          </Routes>
        </Router>
      )}
      {/* <footer>&copy; {new Date().getFullYear()} firebaseApp</footer> */}
    </React.Fragment>
  );
}

export default App;
