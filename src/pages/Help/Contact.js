import React, { useState } from "react";
import main_feature from "../../assets/hero.jpeg";
import {
  Container,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormHelperText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pageUrl, setPageUrl] = useState(
    "https://www.salivaryproteome.org/public/index.php/Main_Page"
  );
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [ratings, setRatings] = useState({
    Information: "",
    Layout: "",
    "Ease of Use": "",
    Accessibility: "",
    Overall: "",
  });
  const [formErrors, setFormErrors] = useState({
    topic: false,
    message: false,
  });

  // Function to validate the form
  const validateForm = () => {
    const newErrors = { topic: false, message: false };

    if (topic === "") {
      newErrors.topic = true; // Set the error state for topic
    }
    if (message === "") {
      newErrors.message = true; // Set the error state for message
    }

    setFormErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some(Boolean);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePageUrlChange = (event) => {
    setPageUrl(event.target.value);
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    setAttachments([...attachments, ...event.target.files]);
  };

  const handleFileRemove = (fileIndex) => {
    setAttachments(attachments.filter((_, index) => index !== fileIndex));
  };

  const handleRatingChange = (event) => {
    const { name, value } = event.target;
    setRatings((prevRatings) => ({ ...prevRatings, [name]: value }));
  };

  const handleSend = () => {
    if (validateForm()) {
      // Submit the form data
      console.log("Form is valid, submitting data...");
      // Reset the form after submission or handle it as needed
    } else {
      console.log("Form is invalid, not submitting data...");
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPageUrl("https://www.salivaryproteome.org/public/index.php/Main_Page");
    setTopic("");
    setMessage("");
    setAttachments([]);
    setRatings({
      Information: "",
      Layout: "",
      "Ease of Use": "",
      Accessibility: "",
      Overall: "",
    });
  };

  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
            paddingTop: "25px",
            paddingLeft: "40px",
          }}
        >
          Contact Us
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "18px",
            paddingBottom: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          Let us know if you have any questions, comments, or suggestions!
          Please provide as much details as possible to help us better respond
          to your inquiry. Screenshots of pages in question can be submitted
          along with your message if desired.
        </p>
      </div>
      <Container>
        <Box
          component="fieldset"
          sx={{ p: 2, mb: 2, mt: 3 }}
        >
          <legend
            style={{
              fontSize: "100%",
              backgroundColor: "#e5e5e5",
              color: "#222",
              padding: "0.1em 0.5em",
              border: "2px solid #d8d8d8",
            }}
          >
            Fill in the form below
          </legend>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <Grid
              container
              spacing={2}
            >
              {/* Name and Email fields */}
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  label="Your name"
                  variant="outlined"
                  value={name}
                  onChange={handleNameChange}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  fullWidth
                  label="Your e-mail"
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Grid>

              {/* Page URL field */}
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Page you were on"
                  variant="outlined"
                  value={pageUrl}
                  onChange={handlePageUrlChange}
                />
              </Grid>

              {/* Topic selection */}
              <Grid
                item
                xs={12}
              >
                <FormControl
                  fullWidth
                  required
                  error={formErrors.topic} // Use the error state here
                >
                  <InputLabel>Topic</InputLabel>
                  <Select
                    value={topic}
                    label="Topic"
                    onChange={handleTopicChange}
                    displayEmpty
                  >
                    {[
                      "Biological Issue",
                      "Technical Issue",
                      "Suggestions",
                      "Others",
                    ].map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.topic && (
                    <FormHelperText>Please select a topic.</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Message field */}
              <Grid
                item
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={message}
                  onChange={handleMessageChange}
                  required
                  error={formErrors.message} // Use the error state here
                  helperText={formErrors.message && "Message is required."}
                />
              </Grid>

              {/* Attachments */}
              <Grid
                item
                xs={12}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography
                    display="inline"
                    variant="subtitle1"
                    sx={{ mr: 2, fontFamily: "Lato" }}
                  >
                    Attachments:
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Files
                    <input
                      type="file"
                      hidden
                      multiple
                      onChange={handleAttachmentChange}
                    />
                  </Button>
                </Box>
                {attachments.length > 0 && (
                  <Paper
                    variant="outlined"
                    sx={{ p: 2 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1 }}
                    >
                      Uploaded Files:
                    </Typography>
                    <List>
                      {attachments.map((file, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <AttachmentIcon />
                          </ListItemIcon>
                          <ListItemText>
                            <Chip
                              label={`File ${index + 1}: ${file.name}`}
                              variant="outlined"
                              onDelete={() => handleFileRemove(index)}
                            />
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Grid>

              {/* Optional Ratings */}
              <Grid
                item
                xs={12}
              >
                <div
                  style={{
                    height: "3px",
                    background: "linear-gradient(to right, #1463B9, #ffffff)",
                    marginTop: "30px",
                    marginBottom: "20px",
                  }}
                ></div>
                <Accordion sx={{ boxShadow: 2, mb: 2 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "black", fontFamily: "Lato" }}
                    >
                      Optional Ratings
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {[
                      "Information",
                      "Layout",
                      "Ease of Use",
                      "Accessibility",
                      "Overall",
                    ].map((category) => (
                      <Grid
                        item
                        xs={12}
                        key={category}
                      >
                        <FormControl component="fieldset">
                          <FormLabel component="legend">{category}</FormLabel>
                          <RadioGroup
                            row
                            name={category}
                            value={ratings[category]}
                            onChange={handleRatingChange}
                          >
                            {[
                              "Very Satisified",
                              "Satisfied",
                              "Neutral",
                              "Dissatisfied",
                              "Very Dissatisfied",
                            ].map((option) => (
                              <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio />}
                                label={option}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <Typography
                  variant="body2"
                  sx={{ mt: 2, mb: 1, textAlign: "center", fontFamily: "Lato" }}
                >
                  Leave your contact information blank to submit this form
                  anonymously. However, we will not be able to reply back
                  regarding your comments.
                </Typography>
              </Grid>
              {/* Submit Button */}
              <Grid
                item
                xs={12}
              >
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "center", // Centers the buttons horizontally
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Contact;
