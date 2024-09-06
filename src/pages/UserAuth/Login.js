import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import Swal from "sweetalert2";
import userpool from "../../userpool";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [unconfirmedUsername, setUnconfirmedUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    login(username, password, (err, result) => {
      if (err) {
        console.error(err.message);
        if (err.message === "User is not confirmed.") {
          setUnconfirmedUsername(username);
          setError(
            <span>
              Login failed. Please follow the steps in the email to verify your
              account and try again.
              <br />
              <a
                href="#"
                onClick={(e) => {
                  const cognitoUser = new CognitoUser({
                    Username: unconfirmedUsername,
                    Pool: userpool,
                  });

                  cognitoUser.resendConfirmationCode((err, result) => {
                    if (err) {
                      console.error("", err);
                      Swal.fire({
                        title: "Error sending verification email",
                        text: err.message,
                        icon: "error",
                        confirmButtonColor: "#1464b4",
                      });
                    } else {
                      Swal.fire({
                        title: "Verification email sent",
                        text: `Please check email association with: ${unconfirmedUsername}`,
                        icon: "success",
                        confirmButtonColor: "#1464b4",
                      });
                    }
                  });
                }}
              >
                Resend verification email
              </a>
              ?
            </span>
          );
        } else {
          setError(
            <span>
              Login failed. Please check your credentials and try again.
            </span>
          );
        }
      }
      setLoading(false);
      if (result) navigate("/");
    });
  };

  return (
    <Grid container justifyContent="center" sx={{ backgroundColor: "#f5f5f5" }}>
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
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
              <Typography color="error" variant="body2" mt={2}>
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Box>
            <Box textAlign="center" mt={3}>
              <Typography variant="body2">
                No account?{" "}
                <Button
                  color="primary"
                  component={Link}
                  to="/signup"
                  sx={{ textTransform: "none" }}
                >
                  Create one
                </Button>
              </Typography>
            </Box>
            <Box textAlign="center" mt={2}>
              <Button
                color="primary"
                component={Link}
                to="/forgot-password"
                sx={{ textTransform: "none" }}
              >
                Forgot Password?
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
