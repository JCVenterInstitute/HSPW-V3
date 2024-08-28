import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../services/AuthContext";
import { TextField, Button, Box, Typography, Container, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const Profile = () => {
  const { user, session } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [editData, setEditData] = useState(userData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            firstName: attributeMap["given_name"] || "",
            lastName: attributeMap["family_name"] || "",
            email: attributeMap["email"] || "",
          });

          setEditData({
            firstName: attributeMap["given_name"] || "",
            lastName: attributeMap["family_name"] || "",
            email: attributeMap["email"] || "",
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
      [name]: value,
    });
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    if (user) {
      user.updateAttributes(
        [
          { Name: "given_name", Value: editData.firstName },
          { Name: "family_name", Value: editData.lastName },
          { Name: "email", Value: editData.email },
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>

        {/* Display user information */}
        <Typography variant="body1">
          <strong>First Name:</strong> {userData.firstName}
        </Typography>
        <Typography variant="body1">
          <strong>Last Name:</strong> {userData.lastName}
        </Typography>
        <Typography variant="body1">
          <strong>Email:</strong> {userData.email}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDialogOpen}
          sx={{ mt: 2 }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Dialog for editing user information */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="First Name"
            name="firstName"
            value={editData.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={editData.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
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
    </Container>
  );
};

export default Profile;