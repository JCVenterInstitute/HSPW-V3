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
import { useNavigate } from "react-router-dom"; // To navigate after success
import Swal from "sweetalert2"; // SweetAlert2 for success message
import userpool from "../../userpool";
import { initialPasswordRequirements } from "./AuthConsts"; // Import password requirements

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState(
    initialPasswordRequirements
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate(); // To navigate after successful password reset

  // Handle password validation
  const handlePasswordChange = (password) => {
    setNewPassword(password);

    const updatedRequirements = initialPasswordRequirements.map(
      (requirement) => ({
        ...requirement,
        isMet: requirement.regex.test(password),
      })
    );

    setPasswordRequirements(updatedRequirements);
    setIsPasswordValid(updatedRequirements.every((req) => req.isMet));
  };

  const handleSendResetLink = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userpool,
    });

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        setStep(2); // Move to verification code input step
        setLoading(false);
        setUsernameError(false);
      },
      onFailure: (err) => {
        setUsernameError(true);
        setUsernameErrorMessage("Username does not exist.");
        setLoading(false);
      },
    });
  };

  const handleConfirmVerificationCode = (e) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Password does not meet the required criteria.");
      return;
    }

    setLoading(true);
    setError("");

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userpool,
    });

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        setLoading(false);
        // Show SweetAlert success message
        Swal.fire({
          title: "Success!",
          text: "Your password has been changed successfully.",
          icon: "success",
          confirmButtonText: "Go to Login",
        }).then(() => {
          navigate("/login"); // Redirect to login page after alert
        });
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
                  setUsernameError(false);
                }}
                label="Username"
                required
                fullWidth
                margin="normal"
                error={usernameError}
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
                onChange={(e) => handlePasswordChange(e.target.value)} // Call password handler
                label="New Password"
                type="password"
                required
                fullWidth
                margin="normal"
              />
              <Box mt={2}>
                <Typography variant="body2">
                  Password must meet the following criteria:
                </Typography>
                <ul>
                  {passwordRequirements.map((req, idx) => (
                    <li
                      key={idx}
                      style={{
                        color: req.isMet ? "green" : "red",
                      }}
                    >
                      {req.requirement}
                    </li>
                  ))}
                </ul>
              </Box>
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
                  disabled={loading || !isPasswordValid}
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
