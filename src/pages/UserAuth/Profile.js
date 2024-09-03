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
} from "@mui/material";

const Profile = () => {
  const { user, session } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    title: "",
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    institution: "",
  });
  const [editData, setEditData] = useState(userData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            title: attributeMap["custom:title"] || "",
            firstName: attributeMap["given_name"] || "",
            middleInitial: attributeMap["custom:middle_initial"] || "",
            lastName: attributeMap["family_name"] || "",
            email: attributeMap["email"] || "",
            institution: attributeMap["custom:institution"] || "",
          });

          setEditData({
            title: attributeMap["custom:title"] || "",
            firstName: attributeMap["given_name"] || "",
            middleInitial: attributeMap["custom:middle_initial"] || "",
            lastName: attributeMap["family_name"] || "",
            email: attributeMap["email"] || "",
            institution: attributeMap["custom:institution"] || "",
          });
        });
      }
    };

    fetchUserData();
  }, [user, session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name === "middleInitial" ? value.toUpperCase() : value, // Capitalize middle initial
    });
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

  const handleSave = async () => {
    if (user) {
      user.updateAttributes(
        [
          { Name: "custom:title", Value: editData.title },
          { Name: "given_name", Value: editData.firstName },
          { Name: "custom:middle_initial", Value: editData.middleInitial },
          { Name: "family_name", Value: editData.lastName },
          { Name: "email", Value: editData.email },
          { Name: "custom:institution", Value: editData.institution },
        ],
        (err, result) => {
          if (err) {
            console.error("Error updating user data:", err);
            return;
          }

          setUserData(editData);
          setIsDialogOpen(false);
          console.log("Successfully updated user attributes:", result);
        }
      );
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (user) {
      user.changePassword(
        session.getAccessToken().getJwtToken(),
        newPassword,
        (err, result) => {
          if (err) {
            console.error("Error changing password:", err);
            return;
          }

          alert("Password changed successfully");
          setPasswordDialogOpen(false);
          setNewPassword("");
          setConfirmPassword("");
          console.log("Password changed successfully:", result);
        }
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
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
      </Box>

      {/* Dialog for editing user information */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="form-box-title-field">Title</InputLabel>
                <Select
                  labelId="form-box-title-field"
                  name="title"
                  value={editData.title}
                  onChange={handleInputChange}
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
                value={editData.firstName}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Middle Initial"
                name="middleInitial"
                value={editData.middleInitial}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Last Name"
                name="lastName"
                value={editData.lastName}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Institution"
                name="institution"
                value={editData.institution}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for changing password */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
