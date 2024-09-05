import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    login(email, password, (err, result) => {
      if (err)
        setError("Login failed. Please check your credentials and try again.");
      setLoading(false);
      if (result) navigate("/");
    });
  };

  return (
    <Grid container justifyContent="center" sx={{ backgroundColor: "#f5f5f5" }}>
      <Grid item xs={12} sm={8} md={5}>
        <Paper
          elevation={3}
          sx={{ padding: "2rem", borderRadius: "10px", marginY: "20px" }}
        >
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
          </Box>
          <form onSubmit={handleLogin}>
            <TextField
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Username"
              required
              fullWidth
              margin="normal"
            />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              required
              fullWidth
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="body2" mt={2}>
                {error}
              </Typography>
            )}
            <Box textAlign="center" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </Box>
            <Box textAlign="center" mt={3}>
              <Typography variant="body2">
                No account?{" "}
                <Button color="primary" component={Link} to="/signup">
                  Create one
                </Button>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
