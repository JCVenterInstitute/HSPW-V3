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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QueryString from "qs";
import Swal from "sweetalert2";
import XMLParser from "react-xml-parser";

const PsiBlastSequenceParameters = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [parameterDetails, setParameterDetails] = useState([]);
  const [parameterValue, setParameterValue] = useState({});
  const [resetValue, setResetValue] = useState({});
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [sequence, setSequence] = useState("");
  const [fieldValues, setFieldValues] = useState({
    "Checkpoint File": "",
    "Pattern File": "",
    "Selected Hits": "",
    "Previous Iteration Job Id": "",
  });

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

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "Previous Iteration Job Id") {
      setFieldValues({ ...fieldValues, [fieldName]: value });
    } else {
      const file = value.target.files[0]; // Get the selected file
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setFieldValues({ ...fieldValues, [fieldName]: content });
        };
        reader.readAsText(file); // Read the file as text
      }
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
              ? parameterDetail.values.values.find(
                  (option) => option.defaultValue === true
                )?.value
              : null,
        };
        if (parameterDetail.name === "Database") {
          defaultValue[parameterDetail.name].value =
            parameterDetail.values.values[13].value;
        }
      }
      setParameterValue(defaultValue);
      setResetValue(defaultValue);
      setParameterDetails([...parameterDetailArray]);
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
      const data = {
        email: email,
        title: title,
        sequence: sequence,
        ...(fieldValues["Checkpoint File"] !== "" && {
          cpfile: fieldValues["Checkpoint File"],
        }),
        ...(fieldValues["Pattern File"] !== "" && {
          patfile: fieldValues["Pattern File"],
        }),
        ...(fieldValues["Previous Iteration Job Id"] !== "" && {
          previousjobid: fieldValues["Previous Iteration Job Id"],
        }),
        ...(fieldValues["Selected Hits"] !== "" && {
          selectedHits: fieldValues["Selected Hits"],
        }),
      };
      for (const key of Object.keys(parameterValue)) {
        const option = parameterValue[key];
        if (
          option.name !== "sequence" &&
          option.name !== "cpfile" &&
          option.name !== "patfile" &&
          option.name !== "previousjobid" &&
          option.name !== "selectedHits"
        ) {
          data[option.name] = option.value;
        }
      }
      const payload = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: QueryString.stringify(data),
        url: `https://www.ebi.ac.uk/Tools/services/rest/${url}/run`,
      };
      const jobId = await axios(payload)
        .then((res) => res.data)
        .finally(() => {
          Swal.close();
        });
      window.location.href = `/${url}/results/${jobId}`;
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

  return (
    <>
      {!loading ? (
        <>
          <Box
            component="fieldset"
            sx={{ p: 2, mb: 2 }}
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
              STEP 1 - Select your database
            </legend>
            <Typography sx={{ color: "black" }}>Protein Databases:</Typography>
            {parameterDetails.length !== 0 && parameterValue && (
              <TextField
                select
                size="small"
                sx={{ width: "850px" }}
                value={parameterValue["Database"].value}
                onChange={(event) => {
                  const newValue = {
                    ...parameterValue, // Create a copy of the existing state
                    ["Database"]: {
                      ...parameterValue["Database"], // Create a shallow copy of the nested object
                      value: event.target.value, // Update the 'value' property of the nested object
                    },
                  };
                  setParameterValue(newValue);
                }}
              >
                {parameterDetails[13].values.values.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
          <Box
            component="fieldset"
            sx={{ p: 2, mb: 2 }}
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
              STEP 2 - Enter your input sequences
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
              <Button
                sx={{ ml: 1 }}
                variant="contained"
                component="label"
              >
                Upload File
                <input
                  type="file"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
            </Typography>
          </Box>
          <Box
            component="fieldset"
            sx={{ p: 2, mb: 2 }}
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
              STEP 3 - Set your parameters
            </legend>
            <Accordion sx={{ boxShadow: 2, mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: "black" }}
                >
                  Optional Parameters
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  spacing={1}
                >
                  {parameterDetails.map((detail, index) => {
                    if (
                      detail.name !== "Sequence" &&
                      detail.name !== "Checkpoint File" &&
                      detail.name !== "Pattern File" &&
                      detail.name !== "Previous Iteration Job Id" &&
                      detail.name !== "Selected Hits" &&
                      detail.name !== "Database"
                    ) {
                      return (
                        <Grid
                          item
                          xs={4}
                          key={index}
                        >
                          <Grid
                            container
                            spacing={1}
                          >
                            <Grid
                              item
                              xs={12}
                            >
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
                            <Grid
                              item
                              xs={12}
                            >
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
                  {parameterDetails.map((detail, index) => {
                    if (
                      detail.name === "Checkpoint File" ||
                      detail.name === "Pattern File" ||
                      detail.name === "Selected Hits"
                    ) {
                      return (
                        <Grid
                          item
                          xs={4}
                          key={index}
                        >
                          <Grid
                            container
                            spacing={1}
                          >
                            <Grid
                              item
                              xs={12}
                            >
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
                            <Grid
                              item
                              xs={12}
                            >
                              <TextField
                                size="small"
                                sx={{ width: "300px" }}
                                type="file"
                                id="file-input"
                                onChange={(e) =>
                                  handleFieldChange(detail.name, e)
                                }
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    } else if (detail.name === "Previous Iteration Job Id") {
                      return (
                        <Grid
                          item
                          xs={4}
                          key={index}
                        >
                          <Grid
                            container
                            spacing={1}
                          >
                            <Grid
                              item
                              xs={12}
                            >
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
                            <Grid
                              item
                              xs={12}
                            >
                              <TextField
                                size="small"
                                sx={{ width: "300px" }}
                                onChange={(e) =>
                                  handleFieldChange(detail.name, e.target.value)
                                }
                              ></TextField>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    }
                  })}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box
            component="fieldset"
            sx={{ p: 2, mb: 2 }}
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
              STEP 4 - Submit your job
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
            <Stack
              direction="row"
              spacing={2}
            >
              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
              >
                Reset
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <LinearProgress />
      )}
    </>
  );
};

export default PsiBlastSequenceParameters;
