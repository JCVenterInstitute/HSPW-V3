import { Button, TextField, Select, MenuItem, Box, Grid, Typography, Paper, FormControl, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../userpool";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    title: "",
    givenName: "",
    middleInitial: "",
    familyName: "",
    institution: "",
    emailErr: "",
    passwordErr: "",
    givenNameErr: "",
    middleInitialErr: "",
    familyNameErr: "",
    institutionErr: "",
  });

  const formRegex = {
    email: [
      {
        regex: /^[a-zA-Z0-9._%±]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errMsg: <span>Invalid Email Address</span>,
      },
    ],
    password: [{}, {}, {}, {}],
    givenName: [
      { regex: /^[a-zA-Z.]+$/, errMsg: <span>Name may only contain letters and .</span> },
    ],
    middleInitial: [
      { regex: /^[a-zA-Z]{0,1}$/, errMsg: <span>Middle initial must be a letter</span> },
    ],
    familyName: [],
    institution: [],
  };

  const formDataUpdate = (formField, value) => {
    setFormData((prevData) => ({ ...prevData, [formField]: value }));
    console.log(formData[formField]);
  };

  const submitValidation = () => {
    let errors = {
      emailErr: "",
      passwordErr: "",
      givenNameErr: "",
      familyNameErr: "",
    };

    let isValid = true;

    if (formData.email === "") {
      errors.emailErr = (
        <>
          <span>"Email is Required"</span>
          <br />
          <span>"Email is Required"</span>
        </>
      );
      isValid = false;
    }

    if (formData.givenName === "") {
      errors.givenNameErr = "First Name is Required";
      isValid = false;
    }

    if (formData.familyName === "") {
      errors.familyNameErr = "Last Name is Required";
      isValid = false;
    }

    if (formData.password === "") {
      errors.passwordErr = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.passwordErr = "Password must be at least 8 characters long";
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
      console.log(result);
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
              onBlur={submitValidation}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.givenNameErr)}
            />
            <TextField
              value={formData.middleInitial}
              onChange={(e) => formDataUpdate("middleInitial", e.target.value)}
              label="Middle Initial"
              inputProps={{maxlength: 1, style: { textTransform: 'uppercase' }}}
              fullWidth
              margin="normal"
            />
            <TextField
              value={formData.familyName}
              onChange={(e) => formDataUpdate("familyName", e.target.value)}
              label="Last Name"
              helperText={formData.familyNameErr}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.familyNameErr)}
            />
            <TextField
              value={formData.institution}
              onChange={(e) => formDataUpdate("institution", e.target.value)}
              label="Institution"
              fullWidth
              margin="normal"
            />
            <TextField
              value={formData.email}
              onChange={(e) => formDataUpdate("email", e.target.value)}
              label="Email"
              helperText={formData.emailErr}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.emailErr)}
            />
            <TextField
              value={formData.password}
              onChange={(e) => formDataUpdate("password", e.target.value)}
              type="password"
              label="Password"
              helperText={formData.passwordErr}
              required
              fullWidth
              margin="normal"
              error={Boolean(formData.passwordErr)}
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
