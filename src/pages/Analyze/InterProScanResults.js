import React, { useEffect, useState } from "react";
import main_feature from "../../components/hero.jpeg";
import {
  Typography,
  Container,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import XMLParser from "react-xml-parser";

const InterProScan = () => {
  const { jobId } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [inputSequence, setInputSequence] = useState("");
  const [output, setOutput] = useState("");
  const [toolOutput, setToolOutput] = useState("");
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
      // Continue checking after 3 seconds
      setTimeout(checkStatus, 3000);
    }
  };

  const getResults = async () => {
    let type = "aln-clustal";
    const resultTypes = await axios
      .get(
        `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/resulttypes/${jobId}`
      )
      .then((res) => res.data.types);
    console.log(resultTypes);
    for (const resultType of resultTypes) {
      if (resultType === "aln-clustal_num") {
        type = "aln-clustal_num";
      }
      const result = await axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/${resultType.identifier}`
        )
        .then((res) => res.data);
      console.log(result);
    }
    const [inputSequence, output, toolOutput, submissionDetail] =
      await Promise.all([
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
            `https://www.ebi.ac.uk/Tools/services/rest/iprscan5/result/${jobId}/tsv`
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
    console.log(submissionDetailJson);
    setInputSequence(inputSequence);
    setOutput(output);
    setToolOutput(toolOutput);
    setSubmissionDetail(submissionDetailJson);
  };

  useEffect(() => {
    if (!isFinished) {
      checkStatus();
    } else {
      getResults();
    }
  }, [jobId, isFinished]);

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
          InterProScan 5
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
          InterProScan is a tool that combines different protein signature
          recognition methods into one resource. The number of signature
          databases and their associated scanning tools, as well as the further
          refinement procedures, increases the complexity of the problem.
        </p>
      </div>
      <Container>
        <Typography variant="h5" sx={{ mt: 3, mb: 2, color: "black" }}>
          Results for job {jobId}
        </Typography>
      </Container>
      {!isFinished ? (
        <Container>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mt: 3, color: "blue" }}
          >
            Your job is now queued and will be running shortly... please be
            patient!
          </Typography>
        </Container>
      ) : (
        <Container>
          <Tabs>
            <TabList>
              <Tab>Tool Output</Tab>
              <Tab>Submission Details</Tab>
            </TabList>
            <TabPanel>
              {toolOutput ? (
                <Box
                  sx={{
                    display: "flex",
                    minHeight: "60vh",
                    overflow: "auto", // Allow horizontal scrolling
                  }}
                >
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      overflow: "auto", // Allow horizontal scrolling within the div
                      width: "100%", // Make the div take full width
                    }}
                  >
                    <pre>{toolOutput}</pre>
                  </div>
                </Box>
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
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }} divider>
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
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }} divider>
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
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }} divider>
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
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }} divider>
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
                              <pre style={{ whiteSpace: "pre-wrap" }}>
                                {inputSequence}
                              </pre>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }} divider>
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
                              <pre style={{ whiteSpace: "pre-wrap" }}>
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
                    <Paper elevation={4} sx={{ overflow: "auto" }}>
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
                              <ListItem sx={{ pl: 1, pt: 0, pb: 0 }} divider>
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
                              <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
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
export default InterProScan;
