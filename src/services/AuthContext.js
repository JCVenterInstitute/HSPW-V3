// import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
// // import { HmacSHA256, enc } from "crypto-js";
// import userpool from "../userpool";

// export const authenticate = (Email, Password) => {
//   return new Promise((resolve, reject) => {
//     const user = new CognitoUser({
//       Username: Email,
//       Pool: userpool,
//     });

//     const authDetails = new AuthenticationDetails({
//       Username: Email,
//       Password,
//     });

//     user.authenticateUser(authDetails, {
//       onSuccess: (result) => {
//         console.log("login successful");
//         resolve(result);
//       },
//       onFailure: (err) => {
//         console.log("login failed", err);
//         reject(err);
//       },
//     });
//   });
// };

// export const logout = () => {
//   const user = userpool.getCurrentUser();
//   user.signOut();
//   window.location.href = "/";
// };

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