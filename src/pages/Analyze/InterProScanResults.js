import React, { useEffect, useState } from "react";
import main_feature from "../../assets/hero.jpeg";
import {
  Typography,
  Container,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import XMLParser from "react-xml-parser";

const InterProScanResults = () => {
  const { jobId } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [inputSequence, setInputSequence] = useState("");
  const [output, setOutput] = useState("");
  const [xmlOutput, setXmlOutput] = useState("");
  const [tsvOutput, setTsvOutput] = useState("");
  const [gffOutput, setGffOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState({});
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [parameterDetail, setParameterDetail] = useState([]);

  const checkStatus = async () => {
    const parameterDetailArray = [];
    const status = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/iprscan5/status/${jobId}`)
      .then((res) => res.data);

    const parameters = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/iprscan5/parameters`)
      .then((res) => res.data.parameters);

    for (const parameter of parameters) {
      const parameterDetail = await axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/parameterdetails/${parameter}`
        )
        .then((res) => res.data);
      parameterDetailArray.push(parameterDetail);
    }
    setParameterDetail([...parameterDetailArray]);

    if (status === "FINISHED") {
      setIsFinished(true);
    } else {
      // Continue checking after 5 seconds
      setTimeout(checkStatus, 5000);
    }
  };

  const getResults = async () => {
    const resultTypes = await axios
      .get(
        `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/resulttypes/${jobId}`
      )
      .then((res) => res.data.types);
    console.log("> Result Types", resultTypes);
    // for (const resultType of resultTypes) {
    //   const result = await axios
    //     .get(
    //       `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/${resultType.identifier}`
    //     )
    //     .then((res) => res.data);
    //   console.log(result);
    // }
    const [
      inputSequence,
      log,
      xmlOutput,
      tsvOutput,
      gffOutput,
      jsonOutput,
      submissionDetail,
    ] = await Promise.all([
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/sequence`
        )
        .then((res) => res.data),
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/log`
        )
        .then((res) => res.data),
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/xml`
        )
        .then((res) => res.data),
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/tsv`
        )
        .then((res) => res.data),
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/gff`
        )
        .then((res) => res.data),
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/json`
        )
        .then((res) => res.data),
      axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/submission`
        )
        .then((res) => res.data),
    ]);

    const submissionDetailJson = new XMLParser().parseFromString(
      submissionDetail
    );
    // console.log(submissionDetailJson);
    setInputSequence(inputSequence);
    setOutput(log);
    setXmlOutput(xmlOutput ? xmlOutput : "No Output");
    setTsvOutput(tsvOutput ? tsvOutput : "No Output");
    setGffOutput(gffOutput ? gffOutput : "No Output");
    setJsonOutput(jsonOutput ? { ...jsonOutput } : "No Output");
    setSubmissionDetail(submissionDetailJson);
  };

  useEffect(() => {
    if (!isFinished) {
      checkStatus();
    } else {
      getResults();
    }
  }, [jobId, isFinished]);

  const handleDownload = (fileSuffix) => {
    const fileInfo = {
      fileSuffix: fileSuffix, // Replace with your desired file extension
      content:
        fileSuffix === "xml"
          ? xmlOutput
          : fileSuffix === "tsv"
          ? tsvOutput
          : fileSuffix === "gff3"
          ? gffOutput
          : fileSuffix === "json"
          ? JSON.stringify(jsonOutput)
          : "",
    };

    const blob = new Blob([fileInfo.content], {
      type: fileSuffix === "json" ? "application/json" : "text/plain",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${jobId}.${fileInfo.fileSuffix}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${main_feature})` }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Protein Signature Search</h1>
          <p className="head_text">
            InterProScan is a tool that combines different protein signature
            recognition methods into one resource. The number of signature
            databases and their associated scanning tools, as well as the
            further refinement procedures, increases the complexity of the
            problem.
          </p>
        </Container>
      </div>
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          sx={{ mt: 3, mb: 2, color: "black" }}
        >
          Results for job {jobId}
        </Typography>
      </Container>
      {!isFinished ? (
        <Container maxWidth="xl">
          <Typography
            variant="h5"
            sx={{ mt: 3, color: "#1463B9" }}
          >
            Your job is now queued and will be running shortly... please be
            patient!
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 3, color: "#1463B9" }}
          >
            Your result of your job will appear in this browser window.
          </Typography>
        </Container>
      ) : (
        <Container maxWidth="xl">
          <Tabs>
            <TabList>
              <Tab>Tool Output</Tab>
              <Tab>Submission Details</Tab>
            </TabList>
            <TabPanel>
              {tsvOutput ? (
                <>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("xml")}
                  >
                    Download in XML format
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("tsv")}
                  >
                    Download in TSV format
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("gff3")}
                  >
                    Download in GFF3 format
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("json")}
                  >
                    Download in JSON format
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      minHeight: "60vh",
                      overflow: "auto", // Allow horizontal scrolling
                      mt: 2,
                    }}
                  >
                    <div
                      style={{
                        whiteSpace: "pre-wrap",
                        overflow: "auto", // Allow horizontal scrolling within the div
                        width: "100%", // Make the div take full width
                      }}
                    >
                      <pre>{tsvOutput}</pre>
                    </div>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </TabPanel>
            <TabPanel>
              {submissionDetail ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      "& > :not(style)": {
                        m: 1,
                        minWidth: 128,
                      },
                    }}
                  >
                    <Paper elevation={4}>
                      <List>
                        <ListItem
                          sx={{ pl: 1, pt: 0, pb: 0 }}
                          divider
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                              >
                                Program
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText
                            primary={
                              submissionDetail.children[1].children[0]
                                .children[1].value
                            }
                          />
                        </ListItem>
                      </List>
                    </Paper>
                    <Paper elevation={4}>
                      <List>
                        <ListItem
                          sx={{ pl: 1, pt: 0, pb: 0 }}
                          divider
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                              >
                                Version
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText
                            primary={
                              submissionDetail.children[1].children[1]
                                .children[1].value
                            }
                          />
                        </ListItem>
                      </List>
                    </Paper>
                    <Paper elevation={4}>
                      <List>
                        <ListItem
                          sx={{ pl: 1, pt: 0, pb: 0 }}
                          divider
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                              >
                                Number of Sequences
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText
                            primary={
                              submissionDetail.children[1].children[2]
                                .children[1].value
                            }
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      "& > :not(style)": {
                        m: 1,
                        minWidth: 128,
                      },
                    }}
                  >
                    <Paper elevation={4}>
                      <List>
                        <ListItem
                          sx={{ pl: 1, pt: 0, pb: 0 }}
                          divider
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                              >
                                Input Sequences
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText
                            primary={
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                }}
                              >
                                {inputSequence}
                              </pre>
                            }
                          />
                        </ListItem>
                        <ListItem
                          sx={{ mt: 2, pl: 1, pt: 0, pb: 0 }}
                          divider
                        >
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                              >
                                Output Result log
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText
                            primary={
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                }}
                              >
                                {output}
                              </pre>
                            }
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ ml: 1, mt: 2, color: "black" }}
                  >
                    Command
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      "& > :not(style)": {
                        m: 1,
                        minWidth: 128,
                      },
                    }}
                  >
                    <Paper
                      elevation={4}
                      sx={{ overflow: "auto" }}
                    >
                      <List>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText
                            primary={
                              <pre
                                style={{
                                  whiteSpace: "pre-wrap",
                                  wordWrap: "break-word",
                                }}
                              >
                                {submissionDetail.children[0].value}
                              </pre>
                            }
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{ ml: 1, mt: 2, color: "black" }}
                  >
                    Input Parameters
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      "& > :not(style)": {
                        m: 1,
                        minWidth: 128,
                      },
                    }}
                  >
                    <Paper elevation={4}>
                      <List>
                        {parameterDetail
                          .slice(0, -2)
                          .map((parameter, index) => (
                            <React.Fragment key={index}>
                              <ListItem
                                sx={{ pl: 1, pt: 0, pb: 0 }}
                                divider
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      sx={{
                                        color: "black",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {parameter.name}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                              <ListItem sx={{ pl: 1, pt: 0, pb: 0, mb: 1 }}>
                                <ListItemText
                                  primary={
                                    submissionDetail.children[1].children[
                                      index + 3
                                    ].children[1].value
                                  }
                                />
                              </ListItem>
                            </React.Fragment>
                          ))}
                      </List>
                    </Paper>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
            </TabPanel>
          </Tabs>
        </Container>
      )}
    </>
  );
};
export default InterProScanResults;
