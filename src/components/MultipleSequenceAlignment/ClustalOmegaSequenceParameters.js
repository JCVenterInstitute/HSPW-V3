import { useContext, useEffect, useState } from "react";
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

import userpool from "../../userpool";
import { AuthContext } from "../../services/AuthContext";

const ClustalOmegaSequenceParameters = ({ url }) => {
  const { user, session } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [parameterDetails, setParameterDetails] = useState([]);
  const [parameterValue, setParameterValue] = useState({});
  const [resetValue, setResetValue] = useState({});
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [sequence, setSequence] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
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

          setEmail(attributeMap["email"] || "");
        });
      }
    };

    fetchEmail();
  }, [user, session]);

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

      if (defaultValue["Output alignment format"]) {
        defaultValue["Output alignment format"].value = "clustal";

        const index = parameterDetailArray.findIndex(
          (object) => object.name === "Output alignment format"
        );

        // Swap the options so that the default value becomes clustalW
        [
          parameterDetailArray[index].values.values[0],
          parameterDetailArray[index].values.values[1],
        ] = [
          parameterDetailArray[index].values.values[1],
          parameterDetailArray[index].values.values[0],
        ];
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
      const currUser = userpool.getCurrentUser();
      const username = currUser.getUsername();

      const data = {
        email: email,
        title: title,
        sequence: sequence,
      };

      for (const key of Object.keys(parameterValue)) {
        const option = parameterValue[key];

        if (option.name !== "sequence") {
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

      // Create submission in HSP to track
      const submissionPayload = {
        user: username,
        type: "Multiple Sequence Alignment",
        link: `/${url}/results/${jobId}`,
        status: "Running",
        id: jobId,
        name: title,
      };

      // Create HSP submission in running status
      await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/api/submissions`,
        submissionPayload
      );

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
              STEP 2 - Set your parameters
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
                    if (detail.name !== "Sequence") {
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
                    } else {
                      return null;
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
              STEP 3 - Submit your job
            </legend>
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
              If available, the title will be included in the name of the
              submission and can be used as a way to identify your analysis.
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

export default ClustalOmegaSequenceParameters;
