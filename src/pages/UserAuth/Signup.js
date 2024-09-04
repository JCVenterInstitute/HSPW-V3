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
  Collapse,
  List,
  ListItem,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../../userpool";
import { formRegex, initialPasswordRequirements } from "./AuthConsts";

const Signup = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const [passwordRequirements, setPasswordRequirements] = useState(
    initialPasswordRequirements
  );

  const [formData, setFormData] = useState({
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

  const formDataUpdate = (formField, value) => {
    setFormData((prevData) => ({ ...prevData, [formField]: value }));
  };

  const passwordUpdate = (value) => {
    setFormData((prevData) => ({ ...prevData, ["password"]: value }));
    let tempPassReqs = passwordRequirements;
    passwordRequirements.map((req, index) => {
      tempPassReqs[index].isMet = req.regex.test(value);
    });
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
      emailErr: "",
      passwordErr: "",
      givenNameErr: "",
      familyNameErr: "",
      confirmPasswordErr: "",
    };

    let isValid = true;

    if (formData.email === "") {
      errors.emailErr = "Email is required";
      isValid = false;
    }

    if (formData.givenName === "") {
      errors.givenNameErr = "First Name is required";
      isValid = false;
    }

    if (formData.familyName === "") {
      errors.familyNameErr = "Last Name is required";
      isValid = false;
    }

    passwordRequirements.forEach((element) => {
      if (!element.isMet) {
        errors.passwordErr = "Password requirements not met";
        isValid = false;
      }
    });

    if (formData.password === "") {
      errors.passwordErr = "Password is required";
      isValid = false;
    }

    if (!(formData.confirmPassword === formData.password)) {
      errors.confirmPasswordErr = "Does not match password";
      isValid = false;
    }

    setFormData((prevData) => ({ ...prevData, ...errors }));

    return isValid;
  };

  const handleClick = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!submitValidation()) {
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
        Value: formData.middleInitial,
      }),
      new CognitoUserAttribute({
        Name: "custom:institution",
        Value: formData.institution,
      }),
    ];

    const username = formData.email;
    const password = formData.password;

    userpool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        console.error("Sign Up Error: ", err);
        alert("Couldn't sign up");
        return;
      }
      alert("User Added Successfully");
      navigate("/dashboard");
    });
  };

  return (
    <Grid
      container
      justifyContent="center"
      //alignItems="center"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Paper
          elevation={3}
          sx={{ padding: "2rem", borderRadius: "10px", marginY: "20px" }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
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
                maxlength: 1,
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
              value={formData.password}
              onChange={(e) => passwordUpdate(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
              type="password"
              label="Password"
              helperText={formData.passwordErr}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.passwordErr)}
            />
            <Collapse in={isExpanded}>
              <Box
                sx={{
                  mt: 1, // Margin top to separate from the TextField
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Password must contain:
                </Typography>
                <List>
                  {passwordRequirements.map((requirement, index) => (
                    <ListItem key={index}>
                      <Typography
                        variant="body2"
                        sx={{ color: requirement.isMet ? "blue" : "red" }}
                      >
                        {requirement.requirement}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Collapse>
            <TextField
              value={formData.confirmPassword}
              onChange={(e) =>
                formDataUpdate("confirmPassword", e.target.value)
              }
              label="Confirm Password"
              helperText={formData.confirmPasswordErr}
              onBlur={() =>
                formDataUpdate(
                  "confirmPasswordErr",
                  formData.confirmPassword === formData.password
                    ? ""
                    : "Does not match password"
                )
              }
              type="password"
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.confirmPasswordErr)}
            />
            <Box textAlign="center" mt={2}>
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
