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
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import XMLParser from "react-xml-parser";
import { MSAView, MSAModel } from "react-msaview";
import "./alignmentTool.css";

const ClustalOmegaResults = () => {
  const { jobId } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [inputSequence, setInputSequence] = useState("");
  const [output, setOutput] = useState("");
  const [sequenceCount, setSequenceCount] = useState(0);
  const [alignment, setAlignment] = useState("");
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [parameterDetail, setParameterDetail] = useState([]);
  const [model, setModel] = useState(null);

  const checkStatus = async () => {
    const parameterDetailArray = [];
    const status = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/clustalo/status/${jobId}`)
      .then((res) => res.data);

    const parameters = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/clustalo/parameters`)
      .then((res) => res.data.parameters);

    for (const parameter of parameters) {
      const parameterDetail = await axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/clustalo/parameterdetails/${parameter}`
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
    let type = "aln-clustal";
    const resultTypes = await axios
      .get(
        `https://www.ebi.ac.uk/Tools/services/rest/clustalo/resulttypes/${jobId}`
      )
      .then((res) => res.data.types);
    console.log("> Result Types", resultTypes);
    for (const resultType of resultTypes) {
      if (resultType === "aln-clustal_num") {
        type = "aln-clustal_num";
      }
      // const result = await axios
      //   .get(
      //     `https://www.ebi.ac.uk/Tools/services/rest/clustalo/result/${jobId}/${resultType.identifier}`
      //   )
      //   .then((res) => res.data);
      // console.log(result);
    }
    const [inputSequence, output, alignmentResult, submissionDetail] =
      await Promise.all([
        axios
          .get(
            `https://www.ebi.ac.uk/Tools/services/rest/clustalo/result/${jobId}/sequence`
          )
          .then((res) => res.data),
        axios
          .get(
            `https://www.ebi.ac.uk/Tools/services/rest/clustalo/result/${jobId}/out`
          )
          .then((res) => res.data),
        axios
          .get(
            `https://www.ebi.ac.uk/Tools/services/rest/clustalo/result/${jobId}/${type}`
          )
          .then((res) => res.data),
        axios
          .get(
            `https://www.ebi.ac.uk/Tools/services/rest/clustalo/result/${jobId}/submission`
          )
          .then((res) => res.data),
      ]);

    const sequenceMatch = output.match(/Read (\d+) sequences/);
    const numberOfSequences = parseInt(sequenceMatch[1], 10);

    const submissionDetailJson = new XMLParser().parseFromString(
      submissionDetail
    );

    const model = MSAModel.create({
      id: `${Math.random()}`,
      type: "MsaView",
      data: { msa: inputSequence },
    });
    model.setWidth("1150");

    setModel(model);
    setInputSequence(inputSequence);
    setOutput(output);
    setSequenceCount(numberOfSequences);
    setAlignment(alignmentResult);
    setSubmissionDetail(submissionDetailJson);
  };

  useEffect(() => {
    if (!isFinished) {
      checkStatus();
    } else {
      getResults();
    }
  }, [jobId, isFinished]);

  const handleDownload = () => {
    const fileInfo = {
      fileSuffix: "txt", // Replace with your desired file extension
      content: alignment,
    };

    const blob = new Blob([fileInfo.content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${jobId}.${fileInfo.fileSuffix}`;
    a.click();
    window.URL.revokeObjectURL(url);
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
          Multiple Sequence Alignment
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
          ClustalW is a general purpose multiple sequence alignment program for
          DNA or proteins. It produces biologically meaningful multiple sequence
          alignments of divergent sequences. It calculates the best match for
          the selected sequences, and lines them up so that the identities,
          similarities and differences can be seen. This service is provided by
          the European Bioinformatics Institute (EBI).
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
          <Typography variant="h6" sx={{ mt: 3, color: "black" }}>
            Your result of your job will appear in this browser window.
          </Typography>
        </Container>
      ) : (
        <Container sx={{ minHeight: "60vh" }}>
          <Tabs>
            <TabList>
              <Tab>Alignments</Tab>
              <Tab>Submission Details</Tab>
            </TabList>
            <TabPanel>
              {alignment ? (
                <>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", mr: 1 }}
                    onClick={handleDownload}
                  >
                    Download Alignment File
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      minHeight: "60vh",
                      mb: 2,
                    }}
                  >
                    {/* <pre style={{ whiteSpace: "pre-wrap" }}>{alignment}</pre> */}
                    {model && <MSAView model={model} />}
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
                          <ListItemText primary={sequenceCount} />
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
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0, mt: 2 }} divider>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ color: "black", fontWeight: "bold" }}
                              >
                                Output Result
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
                    <Paper elevation={4}>
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
                          .slice(0, -1)
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
                              <ListItem sx={{ pl: 1, pt: 0, pb: 0, mb: 1 }}>
                                <ListItemText
                                  primary={
                                    submissionDetail.children[1].children[
                                      index + 2
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
export default ClustalOmegaResults;
