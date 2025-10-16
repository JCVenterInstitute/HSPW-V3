import {
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";

import { formRegex, initialPasswordRequirements } from "./AuthConsts";
import PasswordField from "@Components/PasswordField";
import userpool from "../../userpool";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    usernameErr: "",
    email: "",
    emailErr: "",
    password: "",
    passwordErr: "",
    confirmPassword: "",
    confirmPasswordErr: "",
    title: "",
    givenName: "",
    givenNameErr: "",
    middleInitial: "",
    middleInitialErr: "",
    familyName: "",
    familyNameErr: "",
    institution: "",
    institutionErr: "",
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [recaptchaError, setRecaptchaError] = useState("");

  const formDataUpdate = (formField, value) => {
    setFormData((prevData) => ({ ...prevData, [formField]: value }));
  };

  const fieldValidation = (field, fieldErr) => {
    let isValid = true;

    formRegex[field].forEach((element) => {
      if (!element.regex.test(formData[field])) {
        formDataUpdate(fieldErr, element.errMsg);
        isValid = false;
      }
    });

    if (isValid) formDataUpdate(fieldErr, "");
  };

  const submitValidation = () => {
    let errors = {
      emailErr: formData.emailErr,
      passwordErr: formData.passwordErr,
      givenNameErr: formData.givenNameErr,
      familyNameErr: formData.familyNameErr,
      confirmPasswordErr: formData.confirmPasswordErr,
    };

    let isValid = true;

    if (formData.email === "") {
      errors.emailErr = "Email is required";
    }

    if (formData.givenName === "") {
      errors.givenNameErr = "First Name is required";
    }

    if (formData.familyName === "") {
      errors.familyNameErr = "Last Name is required";
    }

    if (formData.password === "") {
      errors.passwordErr = "Password is required";
    }

    if (!(formData.confirmPassword === formData.password)) {
      errors.confirmPasswordErr = "Does not match password";
    }

    Object.values(errors).forEach((error) => {
      if (error !== "") isValid = false;
    });

    setFormData((prevData) => ({ ...prevData, ...errors }));

    return isValid;
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setRecaptchaError(""); // Clear any previous reCAPTCHA errors
  };

  const handleClick = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!submitValidation()) {
      return;
    }

    if (!recaptchaToken) {
      setRecaptchaError("Please complete the reCAPTCHA.");
      return;
    }

    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: formData.email }),
      new CognitoUserAttribute({
        Name: "given_name",
        Value: formData.givenName,
      }),
      new CognitoUserAttribute({
        Name: "family_name",
        Value: formData.familyName,
      }),
      new CognitoUserAttribute({ Name: "custom:title", Value: formData.title }),
      new CognitoUserAttribute({
        Name: "custom:middle_initial",
        Value: formData.middleInitial.toUpperCase(),
      }),
      new CognitoUserAttribute({
        Name: "custom:institution",
        Value: formData.institution,
      }),
    ];

    const { username, password } = formData;

    userpool.signUp(
      username,
      password,
      attributeList,
      null,
      async (err, result) => {
        if (err) {
          Swal.fire({
            title: "Failed to register",
            text: err.message,
            icon: "error",
            confirmButtonColor: "#1464b4",
          });
          return;
        }

        try {
          // Initializes user's Shared Folders folder after the root folder is created
          await axios.post(
            `${process.env.REACT_APP_API_ENDPOINT}/api/create-folder`,
            {
              prefix: `users/${username}/`,
              folderName: "Shared Folders",
              user: username,
            }
          );
        } catch (error) {
          console.error("Error creating folder:", error);
        }

        Swal.fire({
          title: "User registered successfully",
          text: "Please check email for verification before logging in.",
          icon: "success",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "#1464b4",
        }).then(() => navigate("/login"));
      }
    );
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
              Register
            </Typography>
          </Box>
          <form>
            <FormControl fullWidth>
              <InputLabel id="form-box-title-field">Title</InputLabel>
              <Select
                labelId="form-box-title-field"
                value={formData.title}
                onChange={(e) => formDataUpdate("title", e.target.value)}
                label="Title"
                fullWidth
                margin="normal"
              >
                <MenuItem value={""}>Title</MenuItem>
                <MenuItem value={"Dr."}>Dr.</MenuItem>
                <MenuItem value={"Mrs."}>Mrs.</MenuItem>
                <MenuItem value={"Ms."}>Ms.</MenuItem>
                <MenuItem value={"Mr."}>Mr.</MenuItem>
              </Select>
            </FormControl>
            <TextField
              value={formData.givenName}
              onChange={(e) => formDataUpdate("givenName", e.target.value)}
              label="First Name"
              helperText={formData.givenNameErr}
              onBlur={() => fieldValidation("givenName", "givenNameErr")}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.givenNameErr)}
            />
            <TextField
              value={formData.middleInitial}
              onChange={(e) => formDataUpdate("middleInitial", e.target.value)}
              label="Middle Initial"
              helperText={formData.middleInitialErr}
              onBlur={() =>
                fieldValidation("middleInitial", "middleInitialErr")
              }
              inputProps={{
                maxLength: 1,
                style: { textTransform: "uppercase" },
              }}
              fullWidth
              margin="normal"
              error={Boolean(formData.middleInitialErr)}
            />
            <TextField
              value={formData.familyName}
              onChange={(e) => formDataUpdate("familyName", e.target.value)}
              label="Last Name"
              helperText={formData.familyNameErr}
              onBlur={() => fieldValidation("familyName", "familyNameErr")}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.familyNameErr)}
            />
            <TextField
              value={formData.institution}
              onChange={(e) => formDataUpdate("institution", e.target.value)}
              label="Institution"
              helperText={formData.institutionErr}
              onBlur={() => fieldValidation("institution", "institutionErr")}
              fullWidth
              margin="normal"
              error={Boolean(formData.institutionErr)}
            />
            <TextField
              value={formData.email}
              onChange={(e) => formDataUpdate("email", e.target.value)}
              label="Email"
              helperText={formData.emailErr}
              onBlur={() => fieldValidation("email", "emailErr")}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.emailErr)}
            />
            <TextField
              value={formData.username}
              onChange={(e) => formDataUpdate("username", e.target.value)}
              label="Username"
              helperText={formData.usernameErr}
              onBlur={() => fieldValidation("username", "usernameErr")}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.usernameErr)}
            />
            <PasswordField
              password={formData.password}
              confirmPassword={formData.confirmPassword}
              passwordRequirements={initialPasswordRequirements}
              onPasswordChange={(value) => formDataUpdate("password", value)}
              onConfirmPasswordChange={(value) =>
                formDataUpdate("confirmPassword", value)
              }
              passwordError={formData.passwordErr}
              confirmPasswordError={formData.confirmPasswordErr}
              setPasswordError={(error) => formDataUpdate("passwordErr", error)}
              setConfirmPasswordError={(error) =>
                formDataUpdate("confirmPasswordErr", error)
              }
            />
            <Box
              textAlign="center"
              mt={2}
            >
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
                onChange={handleRecaptchaChange}
              />
              {recaptchaError && (
                <Typography
                  color="error"
                  variant="body2"
                  mt={2}
                >
                  {recaptchaError}
                </Typography>
              )}
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
                onClick={handleClick}
              >
                Signup
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Signup;
