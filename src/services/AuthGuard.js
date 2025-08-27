import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // Adjust the path based on where AuthContext is located

const AuthGuard = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Whether user is null (not logged in) or an object (logged in), stop loading
    setLoading(false);
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or component
  }

  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/login" />;
  }

  return children; // Render the child components (protected content) if the user is logged in
};

export default AuthGuard;
