import React, { useState } from "react";
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
import userpool from "../../userpool";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false); // Track if there's an error with the username
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Track step (1: Send reset link, 2: Enter verification code)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(false);

  const handleSendResetLink = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log(username);

    const cognitoUser = new CognitoUser({
      Username: username, // Using username instead of email
      Pool: userpool,
    });

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        setStep(2); // Move to verification code input step
        setLoading(false);
        setUsernameError(false);
      },
      onFailure: (err) => {
        // If the username doesn't exist or other error occurs, display an error message
        setUsernameError(true);
        setUsernameErrorMessage("Username does not exist.");
        setLoading(false);
      },
    });
  };

  const handleConfirmVerificationCode = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cognitoUser = new CognitoUser({
      Username: username, // Use username
      Pool: userpool,
    });

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        alert("Password has been reset successfully.");
        setLoading(false);
        // Redirect or show success message
      },
      onFailure: (err) => {
        setError(err.message);
        setLoading(false);
      },
    });
  };

  const handleResendVerificationCode = () => {
    setResendCooldown(true);

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userpool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        alert("Verification code resent.");
        setResendCooldown(false);
      },
      onFailure: (err) => {
        setError(err.message);
        setResendCooldown(false);
      },
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
              Forgot Password
            </Typography>
          </Box>

          {step === 1 ? (
            <form onSubmit={handleSendResetLink}>
              <TextField
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(false); // Reset error when user types again
                }}
                label="Username"
                required
                fullWidth
                margin="normal"
                error={usernameError} // Show error if username doesn't exist
                helperText={usernameError ? usernameErrorMessage : ""}
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
                  {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
                </Button>
              </Box>
            </form>
          ) : (
            <form onSubmit={handleConfirmVerificationCode}>
              <Typography variant="body1">
                A verification code has been sent to your email.
              </Typography>
              <TextField
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                label="Verification Code"
                required
                fullWidth
                margin="normal"
              />
              <TextField
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                label="New Password"
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
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Confirm Verification Code"
                  )}
                </Button>
              </Box>
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  disabled={resendCooldown}
                  onClick={handleResendVerificationCode}
                >
                  Resend Verification Code
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
