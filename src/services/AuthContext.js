import React, { createContext, useState, useEffect } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import userpool from "../userpool"; // Ensure this imports your Cognito User Pool configuration correctly

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const currentUser = userpool.getCurrentUser();

    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error("Failed to get session:", err);
          setUser(null);
          setSession(null);

          currentUser.signOut();
        } else {
          setUser(currentUser);
          setSession(session);
        }
      });
    }
  }, []);

  const login = (Username, Password, callback) => {
    const user = new CognitoUser({
      Username,
      Pool: userpool,
    });

    const authDetails = new AuthenticationDetails({
      Username,
      Password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        setUser(user);
        setSession(result);
        callback(null, result);
      },
      onFailure: (err) => {
        setUser(null);
        setSession(null);
        callback(err, null);
      },
    });
  };

  const logout = () => {
    if (user) {
      user.signOut();
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
