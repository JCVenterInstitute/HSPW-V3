import { Button, TextField, Box, Grid, Typography, Paper } from "@mui/material";
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
    familyNameErr: "",
  });

  const formDataUpdate = (formField, value) => {
    setFormData({ ...formData, [formField]: value });
  };

  const validation = () => {
    let resolution = { email: "", password: "", givenName: "", familyName: "" };
    return new Promise((resolve, reject) => {
      if (formData.email === "") {
        formDataUpdate("emailErr", "Email is Required");
        resolution.email = "Email is Required";
      }

      if (formData.givenName === "") {
        formDataUpdate("givenNameErr", "First Name is Required");
        resolution.givenName = "First Name is Required";
      }

      if (formData.familyName === "") {
        formDataUpdate("familyNameErr", "Last Name is Required");
        resolution.familyName = "Last Name is Required";
      }

      if (formData.password === "") {
        formDataUpdate("passwordErr", "Password is required");
        resolution.password = "Password is required";
      } else if (formData.password.length < 8) {
        formDataUpdate(
          "passwordErr",
          "Password must be at least 8 characters long"
        );
        resolution.password = "Password must be at least 8 characters long";
      }

      resolve(resolution);
      reject("");
    });
  };

  const handleClick = (e) => {
    formDataUpdate("emailErr", "");
    formDataUpdate("passwordErr", "");
    formDataUpdate("familyNameErr", "");
    formDataUpdate("givenNameErr", "");

    validation()
      .then((res) => {
        if (
          res.email === "" &&
          res.password === "" &&
          res.givenName === "" &&
          res.familyName === ""
        ) {
          const attributeList = [];
          attributeList.push(
            new CognitoUserAttribute({
              Name: "email",
              Value: formData.email,
            })
          );
          attributeList.push(
            new CognitoUserAttribute({
              Name: "given_name",
              Value: formData.givenName,
            })
          );
          attributeList.push(
            new CognitoUserAttribute({
              Name: "family_name",
              Value: formData.familyName,
            })
          );
          attributeList.push(
            new CognitoUserAttribute({
              Name: "custom:title",
              Value: formData.title,
            })
          );
          attributeList.push(
            new CognitoUserAttribute({
              Name: "custom:middle_initial",
              Value: formData.middleInitial,
            })
          );
          attributeList.push(
            new CognitoUserAttribute({
              Name: "custom:institution",
              Value: formData.institution,
            })
          );
          let username = formData.email;
          userpool.signUp(
            username,
            formData.password,
            attributeList,
            null, // ValidationData (if any)
            (err, result) => {
              if (err) {
                console.log("Sign Up Error: ", err);
                alert("Couldn't sign up");
              } else {
                console.log(result);
                alert("User Added Successfully");
                navigate("/dashboard");
              }
            }
          );
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Grid
      container
      justifyContent="center"
      // alignItems="center"
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
            <TextField
              value={formData.title}
              onChange={(e) => formDataUpdate("title", e.target.value)}
              label="Title"
              fullWidth
              margin="normal"
            />
            <TextField
              value={formData.givenName}
              onChange={(e) => formDataUpdate("givenName", e.target.value)}
              label="First Name*"
              helperText={formData.givenNameErr}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              value={formData.middleInitial}
              onChange={(e) => formDataUpdate("middleInitial", e.target.value)}
              label="Middle Initial"
              fullWidth
              margin="normal"
            />
            <TextField
              value={formData.familyName}
              onChange={(e) => formDataUpdate("familyName", e.target.value)}
              label="Last Name*"
              helperText={formData.familyNameErr}
              required
              fullWidth
              margin="normal"
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
              label="Email*"
              helperText={formData.emailErr}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              value={formData.password}
              onChange={(e) => formDataUpdate("password", e.target.value)}
              type="password"
              label="Password*"
              helperText={formData.passwordErr}
              required
              fullWidth
              margin="normal"
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
