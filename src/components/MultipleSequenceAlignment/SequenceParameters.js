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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import QueryString from "qs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SequenceParameters = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parameterDetails, setParameterDetails] = useState([]);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [parameterValue, setParameterValue] = useState({});
  const [sequence, setSequence] = useState("");

  const fetchOptions = async () => {
    const parameterDetailArray = [];
    const defaultValue = {};

    setLoading(true);
    try {
      const parameters = await axios
        .get("https://www.ebi.ac.uk/Tools/services/rest/clustalo/parameters")
        .then((res) => res.data.parameters);

      for (const parameter of parameters) {
        const parameterDetail = await axios
          .get(
            `https://www.ebi.ac.uk/Tools/services/rest/clustalo/parameterdetails/${parameter}`
          )
          .then((res) => res.data);
        parameterDetailArray.push(parameterDetail);
        defaultValue[parameterDetail.name] =
          parameterDetail.values !== null
            ? parameterDetail.values.values[0].value
            : null;
      }
      console.log(defaultValue);
      setParameterValue(defaultValue);
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
    const data = {
      email: email,
      sequence: sequence,
    };
    const payload = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: QueryString.stringify(data),
      url: "https://www.ebi.ac.uk/Tools/services/rest/clustalo/run",
    };
    const jobId = await axios(payload)
      .then((res) => res.data)
      .finally(() => {
        Swal.close();
      });
    navigate(`/clustal-w/results/${jobId}`);
  };

  return (
    <>
      {!loading ? (
        <>
          <Typography sx={{ fontWeight: "bold", ml: 1, color: "black" }}>
            Email:
          </Typography>
          <TextField
            required
            id="email"
            label="(required)"
            size="small"
            sx={{ width: "300px", mb: 2 }}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Accordion sx={{ boxShadow: 2 }}>
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
              <Typography sx={{ fontWeight: "bold", ml: 1, color: "black" }}>
                Title:
              </Typography>
              <TextField
                id="title"
                size="small"
                sx={{ width: "300px", mb: 2 }}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
              <Grid container spacing={1}>
                {parameterDetails.map((detail, index) => {
                  if (detail.name !== "Sequence") {
                    return (
                      <Grid item xs={4} key={index}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography
                              sx={{ fontWeight: "bold", ml: 1, color: "black" }}
                            >
                              {detail.name}:
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              select
                              size="small"
                              sx={{ width: "300px" }}
                              value={parameterValue[detail.name]}
                              onChange={(event) => {
                                const newValue = {
                                  ...parameterValue, // Create a copy of the existing state
                                  [detail.name]: event.target.value, // Update the specific property
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
          <Typography sx={{ fontWeight: "bold", mt: 2, ml: 1, color: "black" }}>
            Sequence:
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
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="outlined">Reset</Button>
          </Stack>
        </>
      ) : (
        <LinearProgress />
      )}
    </>
  );
};

export default SequenceParameters;
