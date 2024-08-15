import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userpool from "../userpool";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = new CognitoUser({
      Username: email,
      Pool: userpool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("Login successful!", result);
        navigate("/dashboard"); // Redirect to dashboard or other route after successful login
      },
      onFailure: (err) => {
        console.error("Login failed: ", err);
        setError("Login failed. Please check your credentials and try again.");
      },
    });
  };

  return (
    <div className="login">
      <div className="form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="formfield">
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              required
              fullWidth
            />
          </div>
          <div className="formfield">
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              required
              fullWidth
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="formfield">
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </div>
          <div>
            No account?
            <Button color="primary" size="large" component={Link} to="/signup">
              Create one
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
