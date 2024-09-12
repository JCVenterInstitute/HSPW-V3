import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../services/AuthContext";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import { formRegex, initialPasswordRequirements } from "./AuthConsts";
import PasswordField from "../../components/PasswordField";

const Profile = () => {
  const { user, session } = useContext(AuthContext);

  const [passwordRequirements, setPasswordRequirements] = useState(
    initialPasswordRequirements
  );
  const [userData, setUserData] = useState({
    username: "",
    title: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    institution: "",
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    oldPasswordErr: "",

    email: "",
    emailErr: "",

    newPassword: "",
    newPasswordErr: "",

    confirmNewPassword: "",
    confirmNewPasswordErr: "",

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && session) {
        user.getUserAttributes((err, attributes) => {
          if (err) {
            console.error("Error fetching user data:", err);
            return;
          }

          const attributeMap = {};
          attributes.forEach((attribute) => {
            attributeMap[attribute.Name] = attribute.Value;
          });
          setUserData({
            username:
              userData.username === ""
                ? user
                    .getUsername()
                    .split(".")
                    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                    .join(".") || ""
                : userData.username,
            title: attributeMap["custom:title"] || "",
            firstName: attributeMap["given_name"] || "",
            middleInitial: attributeMap["custom:middle_initial"] || "",
            lastName: attributeMap["family_name"] || "",
            email: attributeMap["email"] || "",
            institution: attributeMap["custom:institution"] || "",
          });

          setFormData((prevData) => ({
            ...prevData,
            title: attributeMap["custom:title"] || "",
            givenName: attributeMap["given_name"] || "",
            middleInitial: attributeMap["custom:middle_initial"] || "",
            familyName: attributeMap["family_name"] || "",
            email: attributeMap["email"] || "",
            institution: attributeMap["custom:institution"] || "",
          }));
        });
      }
    };

    fetchUserData();
  }, [user, session]);

  useEffect(() => {
    const isFormValid = () => {
      return (
        formData.email &&
        !formData.emailErr &&
        formData.givenName &&
        !formData.givenNameErr &&
        formData.familyName &&
        !formData.familyNameErr &&
        formData.middleInitial.length <= 1 &&
        !formData.middleInitialErr &&
        formData.institution.length <= 100 &&
        !formData.institutionErr
      );
    };

    setIsSaveDisabled(!isFormValid());
  }, [
    formData.email,
    formData.emailErr,
    formData.givenName,
    formData.givenNameErr,
    formData.familyName,
    formData.familyNameErr,
    formData.middleInitial,
    formData.middleInitialErr,
    formData.institution,
    formData.institutionErr,
  ]);

  const formDataUpdate = (formField, value) => {
    setFormData((prevData) => ({ ...prevData, [formField]: value }));
  };

  const passwordUpdate = (value) => {
    setFormData((prevData) => ({ ...prevData, ["newPassword"]: value }));
    let tempPassReqs = [...passwordRequirements];
    tempPassReqs.forEach((req, index) => {
      tempPassReqs[index].isMet = req.regex.test(value);
    });
    setPasswordRequirements(tempPassReqs); // Added this line to update state correctly
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

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  function showCancelConfirmation() {
    return Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel email verification?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, go back",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((confirmationResult) => {
      if (confirmationResult.isConfirmed) {
        return Swal.fire({
          title: "Cancelled",
          text: "Email verification has been cancelled.",
          icon: "success",
          confirmButtonColor: "#1464b4",
        });
      } else {
        return showVerificationAlert(); // Reopen the verification alert
      }
    });
  }

  function showVerificationAlert() {
    return Swal.fire({
      title: "Verification Code Sent",
      text: `A verification code has been sent to your new email\n(${formData.email}). \nPlease enter the code below to verify your email.`,
      input: "text",
      inputPlaceholder: "Enter verification code",
      showCancelButton: true,
      confirmButtonText: "Verify",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1464b4",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: (code) => {
        if (!code) {
          // Return a validation error if no code is entered
          Swal.showValidationMessage("Please enter the verification code.");
          return;
        }

        return new Promise((resolve, reject) => {
          user.verifyAttribute("email", code, {
            onSuccess: (result) => {
              Swal.fire({
                title: "Success",
                text: "Your email has been verified!",
                icon: "success",
                confirmButtonColor: "#1464b4",
              });
              resolve(result);
            },
            onFailure: (err) => {
              Swal.fire({
                title: "Error",
                text: `Verification failed: ${err.message}`,
                icon: "error",
                confirmButtonColor: "#1464b4",
              }).then(() => {
                showVerificationAlert(); // Reopen the verification prompt after showing the error
              });
              reject(err);
            },
          });
        });
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        showCancelConfirmation();
      }
    });
  }

  const handleSave = async () => {
    let errors = {
      emailErr: "",
      givenNameErr: "",
      familyNameErr: "",
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

    setFormData((prevData) => ({ ...prevData, ...errors }));

    if (isValid && user) {
      user.updateAttributes(
        [
          { Name: "custom:title", Value: formData.title },
          { Name: "given_name", Value: formData.givenName },
          { Name: "custom:middle_initial", Value: formData.middleInitial },
          { Name: "family_name", Value: formData.familyName },
          { Name: "email", Value: formData.email },
          { Name: "custom:institution", Value: formData.institution },
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating user data:", err);
            return;
          }
          if (formData.email !== userData.email) {
            showVerificationAlert();
          }
          setUserData({
            username: userData.username,
            title: formData.title,
            firstName: formData.givenName,
            middleInitial: formData.middleInitial,
            lastName: formData.familyName,
            email: formData.email,
            institution: formData.institution,
          });
          setIsDialogOpen(false);
          console.log("Successfully updated user attributes:", result);
        }
      );
    }
  };

  const handlePasswordChange = async () => {
    let errors = {
      newPasswordErr: "",
      confirmNewPasswordErr: "",
      oldPasswordErr: "",
    };

    let isValid = true;

    if (formData.oldPassword === "") {
      errors.oldPasswordErr = "Old password is required";
      isValid = false;
    }

    passwordRequirements.forEach((element) => {
      if (!element.isMet) {
        errors.newPasswordErr = "Password requirements not met";
        isValid = false;
      }
    });

    if (formData.newPassword === "") {
      errors.newPasswordErr = "Password is required";
      isValid = false;
    }

    if (!(formData.confirmNewPassword === formData.newPassword)) {
      errors.confirmNewPasswordErr = "Does not match password";
      isValid = false;
    }

    setFormData((prevData) => ({ ...prevData, ...errors }));

    if (isValid && user) {
      user.changePassword(
        formData.oldPassword,
        formData.newPassword,
        (err, result) => {
          if (err) {
            setPasswordDialogOpen(false);
            Swal.fire({
              title: "Failed to change password",
              text: err.message.includes("username")
                ? "Incorrect password given."
                : err.message,
              icon: "error",
              confirmButtonColor: "#1464b4",
            }).then(() => setPasswordDialogOpen(true));
            return;
          }

          setPasswordDialogOpen(false);
          Swal.fire({
            title: "Password changed successfully",
            icon: "success",
            confirmButtonColor: "#1464b4",
          });
          formDataUpdate("newPassword", "");
          formDataUpdate("confirmNewPassword", "");
          console.log("Password changed successfully:", result);
        }
      );
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      //alignItems="center"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      <Container maxWidth="md">
        {" "}
        {/* Updated to make container wider */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper
            elevation={3}
            sx={{ padding: "2rem", borderRadius: "10px", marginY: "20px" }}
          >
            <Typography variant="h4" gutterBottom>
              {userData.username}'s Profile
            </Typography>

            {/* Display user information */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Title:</strong> {userData.title}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>First Name:</strong> {userData.firstName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Middle Initial:</strong> {userData.middleInitial}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  <strong>Last Name:</strong> {userData.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Email:</strong> {userData.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Institution:</strong> {userData.institution}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
              >
                Edit Profile
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handlePasswordDialogOpen}
                sx={{ ml: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Box>
        {/* Dialog for editing user information */}
        <Dialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="form-box-title-field">Title</InputLabel>
                  <Select
                    labelId="form-box-title-field"
                    value={formData.title}
                    onChange={(e) => formDataUpdate("title", e.target.value)}
                    label="Title"
                  >
                    <MenuItem value={""}>Title</MenuItem>
                    <MenuItem value={"Dr."}>Dr.</MenuItem>
                    <MenuItem value={"Mrs."}>Mrs.</MenuItem>
                    <MenuItem value={"Ms."}>Ms.</MenuItem>
                    <MenuItem value={"Mr."}>Mr.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formData.givenName}
                  onChange={(e) => formDataUpdate("givenName", e.target.value)}
                  onBlur={() => fieldValidation("givenName", "givenNameErr")}
                  fullWidth
                  error={Boolean(formData.givenNameErr)}
                  helperText={formData.givenNameErr}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Middle Initial"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={(e) =>
                    formDataUpdate("middleInitial", e.target.value)
                  }
                  onBlur={() =>
                    fieldValidation("middleInitial", "middleInitialErr")
                  }
                  inputProps={{
                    maxLength: 1,
                    style: { textTransform: "uppercase" },
                  }}
                  fullWidth
                  error={Boolean(formData.middleInitialErr)}
                  helperText={formData.middleInitialErr}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formData.familyName}
                  onChange={(e) => formDataUpdate("familyName", e.target.value)}
                  onBlur={() => fieldValidation("familyName", "familyNameErr")}
                  fullWidth
                  error={Boolean(formData.familyNameErr)}
                  helperText={formData.familyNameErr}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => formDataUpdate("email", e.target.value)}
                  onBlur={() => fieldValidation("email", "emailErr")}
                  fullWidth
                  error={Boolean(formData.emailErr)}
                  helperText={formData.emailErr}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Institution"
                  name="institution"
                  value={formData.institution}
                  onChange={(e) =>
                    formDataUpdate("institution", e.target.value)
                  }
                  onBlur={() =>
                    fieldValidation("institution", "institutionErr")
                  }
                  fullWidth
                  error={Boolean(formData.institutionErr)}
                  helperText={formData.institutionErr}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              disabled={isSaveDisabled}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
        {/* Dialog for changing password */}
        <Dialog
          open={passwordDialogOpen}
          onClose={handlePasswordDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <Container>
            <TextField
              label="Current Password"
              type="password"
              value={formData.oldPassword}
              onChange={(e) => formDataUpdate("oldPassword", e.target.value)}
              error={Boolean(formData.oldPasswordErr)}
              helperText={formData.oldPasswordErr}
              fullWidth
              margin="normal"
            />
            <PasswordField
              password={formData.newPassword}
              confirmPassword={formData.confirmNewPassword}
              passwordRequirements={passwordRequirements}
              onPasswordChange={(value) => passwordUpdate(value)}
              onConfirmPasswordChange={(value) =>
                formDataUpdate("confirmNewPassword", value)
              }
              passwordError={formData.newPasswordErr}
              confirmPasswordError={formData.confirmNewPasswordErr}
              setPasswordError={(value) =>
                formDataUpdate("newPasswordErr", value)
              }
              setConfirmPasswordError={(value) =>
                formDataUpdate("confirmNewPasswordErr", value)
              }
            />
          </Container>
          <DialogActions>
            <Button onClick={handlePasswordDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} color="primary">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Grid>
  );
};

export default Profile;
