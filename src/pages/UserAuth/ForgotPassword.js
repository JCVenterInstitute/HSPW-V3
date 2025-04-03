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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";

import userpool from "../../userpool";
import PasswordField from "@Components/PasswordField";
import { initialPasswordRequirements } from "./AuthConsts";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    username: "",
    usernameError: "",
    verificationCode: "",
    verificationCodeErr: "",
    newPassword: "",
    newPasswordErr: "",
    confirmPassword: "",
    confirmPasswordErr: "",
  });

  const [passwordRequirements, setPasswordRequirements] = useState(
    initialPasswordRequirements
  );
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const navigate = useNavigate();

  const formDataUpdate = (formField, value) => {
    setFormData((prevData) => ({ ...prevData, [formField]: value }));
  };

  const handleRecaptchaChange = (token) => setRecaptchaToken(token);

  const validatePassword = (password) => {
    const updatedRequirements = initialPasswordRequirements.map((req) => ({
      ...req,
      isMet: req.regex.test(password),
    }));
    setPasswordRequirements(updatedRequirements);
    setIsPasswordValid(updatedRequirements.every((req) => req.isMet));
  };

  const handlePasswordChange = (password) => {
    formDataUpdate("newPassword", password);
    validatePassword(password);
  };

  const handleSendResetLink = (e) => {
    e.preventDefault();
    setLoading(true);

    const cognitoUser = new CognitoUser({
      Username: formData.username,
      Pool: userpool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        setStep(2);
        setLoading(false);
        formDataUpdate("usernameError", "");
      },
      onFailure: (err) => {
        setLoading(false);
        formDataUpdate("usernameError", err.message);
      },
    });
  };

  const handleConfirmVerificationCode = (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      Swal.fire({
        title: "ReCAPTCHA verification required",
        text: "Please verify you are not a robot.",
        icon: "error",
        confirmButtonColor: "#1464b4",
      });
      return;
    }

    if (!isPasswordValid) {
      formDataUpdate(
        "newPasswordErr",
        "Password does not meet the required criteria."
      );
      return;
    }

    setLoading(true);

    const cognitoUser = new CognitoUser({
      Username: formData.username,
      Pool: userpool,
    });

    cognitoUser.confirmPassword(
      formData.verificationCode,
      formData.newPassword,
      {
        onSuccess: () => {
          setLoading(false);
          Swal.fire({
            title: "Success!",
            text: "Your password has been changed successfully.",
            icon: "success",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#1464b4",
          }).then(() => navigate("/login"));
        },
        onFailure: (err) => {
          formDataUpdate("verificationCodeErr", err.message);
          setLoading(false);
        },
      }
    );
  };

  const handleResendVerificationCode = () => {
    setResendCooldown(true);

    const cognitoUser = new CognitoUser({
      Username: formData.username,
      Pool: userpool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        Swal.fire({
          title: "Success!",
          text: "Verification code resent.",
          icon: "success",
          confirmButtonColor: "#1464b4",
        });
        setResendCooldown(false);
      },
      onFailure: (err) => {
        Swal.fire({
          title: "Failed to send verification code.",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#1464b4",
        });
        setResendCooldown(false);
      },
    });
  };

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
      >
        <Paper
          elevation={3}
          sx={{ padding: "2rem", borderRadius: "10px", marginY: "20px" }}
        >
          <Box
            textAlign="center"
            mb={3}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
            >
              Forgot Password
            </Typography>
          </Box>

          {step === 1 ? (
            <form onSubmit={handleSendResetLink}>
              <TextField
                value={formData.username}
                onChange={(e) => formDataUpdate("username", e.target.value)}
                label="Username"
                required
                fullWidth
                margin="normal"
                error={Boolean(formData.usernameError)}
                helperText={formData.usernameError}
              />
              <Box
                textAlign="center"
                mt={2}
              >
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
              <TextField
                value={formData.verificationCode}
                onChange={(e) =>
                  formDataUpdate("verificationCode", e.target.value)
                }
                label="Verification Code"
                required
                fullWidth
                margin="normal"
                error={Boolean(formData.verificationCodeErr)}
                helperText={formData.verificationCodeErr}
              />
              <PasswordField
                password={formData.newPassword}
                confirmPassword={formData.confirmPassword}
                passwordRequirements={passwordRequirements}
                onPasswordChange={handlePasswordChange}
                onConfirmPasswordChange={(value) =>
                  formDataUpdate("confirmPassword", value)
                }
                passwordError={formData.newPasswordErr}
                confirmPasswordError={formData.confirmPasswordErr}
                setPasswordError={(value) =>
                  formDataUpdate("newPasswordErr", value)
                }
                setConfirmPasswordError={(value) =>
                  formDataUpdate("confirmPasswordErr", value)
                }
              />
              <Box textAlign="center">
                <ReCAPTCHA
                  sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
                  onChange={handleRecaptchaChange}
                  style={{ display: "inline-block", marginTop: "14px" }} // Centering and adding margin
                />
              </Box>
              <Box
                textAlign="center"
                mt={2}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={
                    loading ||
                    !(
                      isPasswordValid &&
                      formData.verificationCode.length >= 6 &&
                      formData.confirmPassword === formData.newPassword
                    )
                  }
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Confirm Verification Code"
                  )}
                </Button>
                <Box textAlign="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    disabled={resendCooldown} // Disable button while cooldown is active
                    onClick={handleResendVerificationCode}
                    sx={{ mt: 2 }} // Add margin on top
                  >
                    Resend Verification Code
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
