import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../userpool";
import { generateSecretHash } from "../services/authenticate";

const Signup = () => {
  const Navigate = useNavigate();

  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [givenName, setGivenName] = useState("");
  //   const [familyName, setFamilyName] = useState("");
  //   const [emailErr, setEmailErr] = useState("");
  //   const [passwordErr, setPasswordErr] = useState("");
  //   const [givenNameErr, setGivenNameErr] = useState("");
  //   const [familyNameErr, setFamilyNameErr] = useState("");
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
    // if (formField === "givenName") {
    //   setGivenName(value);
    // }
    // if (formField === "familyName") {
    //   setFamilyName(value);
    // }
    // if (formField === "email") {
    //   setEmail(value);
    // }
    // if (formField === "password") {
    //   setPassword(value);
    // }
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
        formDataUpdate("passwordErr", "must be at least 8 characters long");
        resolution.password = "must be at least 8 characters long";
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
      .then(
        (res) => {
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
                  Navigate("/dashboard");
                }
              }
            );
          }
        },
        (err) => console.log("Error: ", err)
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="signup">
      <div className="form">
        <div className="formfield">
          <TextField
            value={formData.title}
            onChange={(e) => formDataUpdate("title", e.target.value)}
            label="Title"
          />
        </div>
        <div className="formfield">
          <TextField
            value={formData.givenName}
            onChange={(e) => formDataUpdate("givenName", e.target.value)}
            label="First Name*"
            helperText={formData.givenNameErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={formData.middleInitial}
            onChange={(e) => formDataUpdate("middleInitial", e.target.value)}
            label="Middle Initial"
          />
        </div>
        <div className="formfield">
          <TextField
            value={formData.familyName}
            onChange={(e) => formDataUpdate("familyName", e.target.value)}
            label="Last Name*"
            helperText={formData.familyNameErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={formData.institution}
            onChange={(e) => formDataUpdate("institution", e.target.value)}
            label="Institution"
          />
        </div>
        <div className="formfield">
          <TextField
            value={formData.email}
            onChange={(e) => {
              formDataUpdate("email", e.target.value);
            }}
            label="Email*"
            helperText={formData.emailErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={formData.password}
            onChange={(e) => {
              formDataUpdate("password", e.target.value);
            }}
            type="password"
            label="Password*"
            helperText={formData.passwordErr}
          />
        </div>
        <div className="formfield">
          <Button type="submit" variant="contained" onClick={handleClick}>
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
