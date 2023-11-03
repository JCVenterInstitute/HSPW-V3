import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  MenuItem,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Stack,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import XMLParser from "react-xml-parser";

const InterProScanSequenceParameters = ({ url }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parameterDetails, setParameterDetails] = useState([]);
  const [parameterValue, setParameterValue] = useState({});
  const [resetValue, setResetValue] = useState({});
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [sequence, setSequence] = useState("");
  const [checked, setChecked] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setSequence(content); // Set the file content to state
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const fetchOptions = async () => {
    const parameterDetailArray = [];
    const defaultValue = {};

    setLoading(true);
    try {
      const parameters = await axios
        .get(`https://www.ebi.ac.uk/Tools/services/rest/${url}/parameters`)
        .then((res) => res.data.parameters);

      for (const parameter of parameters) {
        const parameterDetail = await axios
          .get(
            `https://www.ebi.ac.uk/Tools/services/rest/${url}/parameterdetails/${parameter}`
          )
          .then((res) => res.data);
        parameterDetailArray.push(parameterDetail);
        defaultValue[parameterDetail.name] = {
          name: parameter,
          value:
            parameterDetail.values !== null
              ? parameterDetail.values.values[0].value
              : null,
        };
      }
      setParameterValue(defaultValue);
      setResetValue(defaultValue);
      setParameterDetails([...parameterDetailArray]);
      setChecked(parameterDetailArray[3].values.values.map(() => true));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleSubmit = async () => {
    Swal.fire({
      title: "Submitting the job, please wait...",
    });
    Swal.showLoading();
    try {
      const data = new URLSearchParams();
      data.append("email", email);
      data.append("title", title);
      data.append("sequence", sequence);

      for (const key of Object.keys(parameterValue)) {
        const option = parameterValue[key];
        if (option.name !== "sequence" && option.name !== "appl") {
          data.append(option.name, option.value);
        }
      }
      checked.map((bool, index) => {
        if (bool) {
          data.append("appl", parameterDetails[3].values.values[index].value);
        }
      });

      const payload = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: data.toString(),
        url: `https://www.ebi.ac.uk/Tools/services/rest/${url}/run`,
      };
      const jobId = await axios(payload)
        .then((res) => res.data)
        .finally(() => {
          Swal.close();
        });
      navigate(`/${url}/results/${jobId}`);
    } catch (err) {
      const errorMessage = new XMLParser().parseFromString(err.response.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage.children[0].value,
      });
    }
  };

  const handleReset = () => {
    setEmail("");
    setTitle("");
    setSequence("");
    setParameterValue(resetValue);
  };

  const handleChange = (index) => (event) => {
    const newChecked = [...checked];
    newChecked[index] = event.target.checked;
    setChecked(newChecked);
  };

  return (
    <>
      {!loading ? (
        <>
          <Box component="fieldset" sx={{ p: 2, mb: 2 }}>
            <legend
              style={{
                fontSize: "100%",
                backgroundColor: "#e5e5e5",
                color: "#222",
                padding: "0.1em 0.5em",
                border: "2px solid #d8d8d8",
              }}
            >
              STEP 1 - Enter your input sequences
            </legend>
            <Typography sx={{ mt: 1, color: "black" }}>
              Enter or paste a set of sequences in any supported format:
            </Typography>
            <TextField
              required
              fullWidth
              multiline
              rows={12}
              id="sequence"
              label="(required)"
              sx={{ mt: 1, mb: 2 }}
              value={sequence}
              onChange={(event) => {
                setSequence(event.target.value);
              }}
            />
            <Typography sx={{ mb: 2, color: "black" }}>
              Or, upload a file:
              <Button sx={{ ml: 1 }} variant="contained" component="label">
                Upload File
                <input type="file" onChange={handleFileChange} hidden />
              </Button>
            </Typography>
          </Box>
          <Box component="fieldset" sx={{ p: 2, mb: 2 }}>
            <legend
              style={{
                fontSize: "100%",
                backgroundColor: "#e5e5e5",
                color: "#222",
                padding: "0.1em 0.5em",
                border: "2px solid #d8d8d8",
              }}
            >
              STEP 2 - Set your parameters and select the applications to run
            </legend>
            <Accordion sx={{ boxShadow: 2, mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="subtitle1" sx={{ color: "black" }}>
                  Optional Parameters
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  {parameterDetails.map((detail, index) => {
                    if (
                      detail.name !== "Sequence" &&
                      detail.name !== "Applications"
                    ) {
                      return (
                        <Grid item xs={4} key={index}>
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  ml: 1,
                                  color: "black",
                                }}
                              >
                                {detail.name}:
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                select
                                size="small"
                                sx={{ width: "300px" }}
                                value={parameterValue[detail.name].value}
                                onChange={(event) => {
                                  const newValue = {
                                    ...parameterValue, // Create a copy of the existing state
                                    [detail.name]: {
                                      ...parameterValue[detail.name], // Create a shallow copy of the nested object
                                      value: event.target.value, // Update the 'value' property of the nested object
                                    },
                                  };
                                  setParameterValue(newValue);
                                }}
                              >
                                {detail.values.values.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Box
              component="fieldset"
              sx={{ pl: 2, mt: 2, borderBottom: "none" }}
            >
              <FormControlLabel
                label="SELECT ALL"
                control={
                  <Checkbox
                    checked={checked.every((value) => value)}
                    indeterminate={
                      checked.some((value) => value) &&
                      !checked.every((value) => value)
                    }
                    onChange={() => {
                      const allChecked = checked.every((value) => value);
                      setChecked(
                        parameterDetails[3] &&
                          parameterDetails[3].values.values.map(
                            () => !allChecked
                          )
                      );
                    }}
                  />
                }
              />
            </Box>
            <Box component="fieldset" sx={{ p: 2 }}>
              <Grid container>
                {parameterDetails[3] &&
                  parameterDetails[3].values.values.map((item, index) => (
                    <Grid item xs={4} key={item.value}>
                      <FormControlLabel
                        label={item.label}
                        control={
                          <Checkbox
                            checked={checked[index]}
                            onChange={handleChange(index)}
                            size="small"
                          />
                        }
                      />
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Box>
          <Box component="fieldset" sx={{ p: 2, mb: 2 }}>
            <legend
              style={{
                fontSize: "100%",
                backgroundColor: "#e5e5e5",
                color: "#222",
                padding: "0.1em 0.5em",
                border: "2px solid #d8d8d8",
              }}
            >
              STEP 3 - Submit your job
            </legend>
            <Typography sx={{ mt: 1, mb: 2, color: "black" }}>
              If you want to be notified by email when the results are
              available, enter the email and title below:
            </Typography>
            <Typography sx={{ fontWeight: "bold", ml: 1, color: "black" }}>
              Email:
            </Typography>
            <TextField
              id="email"
              size="small"
              sx={{ width: "300px", mb: 2 }}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <Typography sx={{ fontWeight: "bold", ml: 1, color: "black" }}>
              Title:
            </Typography>
            <TextField
              id="title"
              size="small"
              sx={{ width: "300px", mb: 1 }}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <Typography
              variant="caption"
              display="block"
              sx={{ ml: 1, mb: 2, color: "black", fontStyle: "italic" }}
            >
              If available, the title will be included in the subject of the
              notification email and can be used as a way to identify your
              analysis
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outlined" onClick={handleReset}>
                Reset
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <LinearProgress sx={{ mb: "500px" }} />
      )}
    </>
  );
};

export default InterProScanSequenceParameters;
