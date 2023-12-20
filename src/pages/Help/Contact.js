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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Contact = () => {
  const [attachments, setAttachments] = useState([]);
  const [ratings, setRatings] = useState({
    information: "",
    layout: "",
    easeOfUse: "",
    accessibility: "",
    overall: "",
  });

  const handleAttachmentChange = (event) => {
    // Add the selected files to the attachments array
    setAttachments([...attachments, ...event.target.files]);
  };

  const handleFileRemove = (fileIndex) => {
    // Remove the file from the attachments array
    setAttachments(attachments.filter((_, index) => index !== fileIndex));
  };

  const handleRatingChange = (event) => {
    const { name, value } = event.target;
    setRatings((prevRatings) => ({ ...prevRatings, [name]: value }));
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
          <Typography sx={{ color: "black", mb: 2, fontFamily: "Lato" }}>
            Required fields are indicated by an asterisk{" "}
            <Typography
              display="inline"
              sx={{ color: "red" }}
            >
              *
            </Typography>
          </Typography>
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
                  defaultValue="https://www.salivaryproteome.org/public/index.php/Main_Page"
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
                >
                  <InputLabel>Topic</InputLabel>
                  <Select
                    defaultValue=""
                    label="Topic"
                  >
                    <MenuItem value="">Please Select</MenuItem>
                    {/* Add more MenuItems for other topics */}
                  </Select>
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
                  required
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
                            <FormControlLabel
                              value="Very Satisfied"
                              control={<Radio />}
                              label="Very Satisfied"
                            />
                            <FormControlLabel
                              value="Satisfied"
                              control={<Radio />}
                              label="Satisfied"
                            />
                            <FormControlLabel
                              value="Neutral"
                              control={<Radio />}
                              label="Neutral"
                            />
                            <FormControlLabel
                              value="Dissatisfied"
                              control={<Radio />}
                              label="Dissatisfied"
                            />
                            <FormControlLabel
                              value="Very Dissatisfied"
                              control={<Radio />}
                              label="Very Dissatisfied"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Submit Button */}
              <Grid
                item
                xs={12}
              >
                <Button
                  variant="contained"
                  color="primary"
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Contact;
