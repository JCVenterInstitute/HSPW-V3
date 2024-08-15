import React, { useState } from "react";
import { Button, TextField, Box, Grid, Typography, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import userpool from "../userpool";

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
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Paper
          elevation={3}
          sx={{ padding: "2rem", borderRadius: "10px", marginY: "20px" }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
          </Box>
          <form onSubmit={handleLogin}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              type="email"
              required
              fullWidth
              margin="normal"
            />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              required
              fullWidth
              margin="normal"
            />
            {error && (
              <Typography
                color="error"
                variant="body2"
                align="center"
                sx={{ marginTop: "1rem" }}
              >
                {error}
              </Typography>
            )}
            <Box textAlign="center" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Login
              </Button>
            </Box>
            <Box textAlign="center" mt={3}>
              <Typography variant="body2">
                No account?{" "}
                <Button color="primary" component={Link} to="/signup">
                  Create one
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
