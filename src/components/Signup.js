import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import userpool from "../userpool";
import { generateSecretHash } from "../services/authenticate";

const Signup = () => {
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [givenNameErr, setGivenNameErr] = useState("");
  const [familyNameErr, setFamilyNameErr] = useState("");

  const formInputChange = (formField, value) => {
    if (formField === "givenName") {
      setGivenName(value);
    }
    if (formField === "familyName") {
      setFamilyName(value);
    }
    if (formField === "email") {
      setEmail(value);
    }
    if (formField === "password") {
      setPassword(value);
    }
  };

  const validation = () => {
    let resolution = { email: "", password: "", givenName: "", familyName: "" };
    return new Promise((resolve, reject) => {
      if (email === "") {
        setEmailErr("Email is Required");
        resolution.email = "Email is Required";
      }
      if (givenName === "") {
        setGivenNameErr("First Name is Required");
        resolution.givenName = "First Name is Required";
      }
      if (familyName === "") {
        setFamilyNameErr("Last Name is Required");
        resolution.familyName = "Last Name is Required";
      }
      if (password === "") {
        setPasswordErr("Password is required");
        resolution.password = "Password is required";
      } else if (password.length < 8) {
        setPasswordErr("must be at least 8 characters long");
        resolution.password = "must be at least 8 characters long";
      }
      resolve(resolution);

      reject("");
    });
  };

  const handleClick = (e) => {
    setEmailErr("");
    setPasswordErr("");
    setFamilyNameErr("");
    setGivenNameErr("");

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
                Value: email,
              })
            );
            attributeList.push(
              new CognitoUserAttribute({
                Name: "given_name",
                Value: givenName,
              })
            );
            attributeList.push(
              new CognitoUserAttribute({
                Name: "family_name",
                Value: familyName,
              })
            );
            let username = email;
            userpool.signUp(
              username,
              password,
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
            value={givenName}
            onChange={(e) => formInputChange("givenName", e.target.value)}
            label="First Name"
            helperText={givenNameErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={familyName}
            onChange={(e) => formInputChange("familyName", e.target.value)}
            label="Last Name"
            helperText={familyNameErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={email}
            onChange={(e) => formInputChange("email", e.target.value)}
            label="Email"
            helperText={emailErr}
          />
        </div>
        <div className="formfield">
          <TextField
            value={password}
            onChange={(e) => {
              formInputChange("password", e.target.value);
            }}
            type="password"
            label="Password"
            helperText={passwordErr}
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
