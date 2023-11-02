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

const PSIBlastResults = () => {
  const { jobId } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [inputSequence, setInputSequence] = useState("");
  const [output, setOutput] = useState("");
  const [sequenceCount, setSequenceCount] = useState(0);
  const [alignment, setAlignment] = useState("");
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [parameterDetail, setParameterDetail] = useState([]);

  const checkStatus = async () => {
    const parameterDetailArray = [];
    const status = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/psiblast/status/${jobId}`)
      .then((res) => res.data);

    const parameters = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/psiblast/parameters`)
      .then((res) => res.data.parameters);

    for (const parameter of parameters) {
      const parameterDetail = await axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/psiblast/parameterdetails/${parameter}`
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
    const [submissionDetail] = await Promise.all([
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
          Protein Similarity Search
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
          BLAST stands for Basic Local Alignment Search Tool.The emphasis of
          this tool is to find regions of sequence similarity, which will yield
          functional and evolutionary clues about the structure and function of
          your novel sequence. Position specific iterative BLAST (PSI-BLAST)
          refers to a feature of BLAST 2.0 in which a profile is automatically
          constructed from the first set of BLAST alignments. PSI-BLAST is
          similar to NCBI BLAST2 except that it uses position-specific scoring
          matrices derived during the search, this tool is used to detect
          distant evolutionary relationships. PHI-BLAST functionality is
          available to use patterns to restrict search results.
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
              <Tab>Alignments</Tab>
              <Tab>Submission Details</Tab>
            </TabList>
            <TabPanel>
              {alignment ? (
                <Box
                  sx={{
                    display: "flex",
                    minHeight: "60vh",
                  }}
                >
                  <pre style={{ whiteSpace: "pre-wrap" }}>{alignment}</pre>
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
                            primary={submissionDetail.children[0].value}
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
export default PSIBlastResults;
