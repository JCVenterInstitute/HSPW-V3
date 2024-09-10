import React, { useState, useEffect } from "react";
import {
  TextField,
  Collapse,
  Box,
  Typography,
  List,
  ListItem,
} from "@mui/material";

const PasswordField = ({
  password,
  confirmPassword,
  passwordRequirements,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordError,
  confirmPasswordError,
  setPasswordError,
  setConfirmPasswordError,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [passwordIsTouched, setPasswordIsTouched] = useState(false);
  const [updatedRequirements, setUpdatedRequirements] =
    useState(passwordRequirements);

  useEffect(() => {
    const newRequirements = passwordRequirements.map((req) => ({
      ...req,
      isMet: req.regex.test(password),
    }));
    setUpdatedRequirements(newRequirements);

    if (passwordIsTouched) {
      setPasswordError(
        newRequirements.some((req) => !req.isMet)
          ? "Password requirements not met"
          : ""
      );
    }
  }, [password, passwordRequirements, passwordIsTouched]);

  const handlePasswordChange = (e) => {
    onPasswordChange(e.target.value);
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordError(
      confirmPassword === password ? "" : "Does not match password"
    );
  };

  const handleConfirmPasswordChange = (e) => {
    onConfirmPasswordChange(e.target.value);
  };

  return (
    <>
      <TextField
        value={password}
        onChange={handlePasswordChange}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => {
          setIsExpanded(false);
          setPasswordIsTouched(true);
          validateConfirmPassword();
        }}
        type="password"
        label="Password"
        helperText={passwordError}
        required
        fullWidth
        margin="normal"
        error={Boolean(passwordError)}
      />
      <Collapse in={isExpanded}>
        <Box
          sx={{
            mt: 1,
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
            {updatedRequirements.map((requirement, index) => (
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
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        onBlur={validateConfirmPassword}
        label="Confirm Password"
        helperText={confirmPasswordError}
        type="password"
        required
        fullWidth
        margin="normal"
        error={Boolean(confirmPasswordError)}
      />
    </>
  );
};

export default PasswordField;
