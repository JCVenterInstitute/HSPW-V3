import React, { useEffect, useState } from "react";
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
import XMLParser from "react-xml-parser";
import Swal from "sweetalert2";
import { awsJsonUpload } from "../../utils/AwsJsonUpload";

import PageHeader from "@Components/Layout/PageHeader";
import "react-tabs/style/react-tabs.css";

const PsiBlastResults = () => {
  const { jobId } = useParams();
  const [isFinished, setIsFinished] = useState(false);
  const [inputSequence, setInputSequence] = useState("");
  const [toolOutput, setToolOutput] = useState("");
  const [output, setOutput] = useState("");
  const [xmlOutput, setXmlOutput] = useState("");
  const [visualSvgOutput, setVisualSvgOutput] = useState(null);
  const [visualPngOutput, setVisualPngOutput] = useState(null);
  const [outputDetail, setOutputDetail] = useState({});
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [parameterDetail, setParameterDetail] = useState([]);

  useEffect(() => {
    const fetchParameters = async () => {
      const parameterDetailArray = [];

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
    };

    fetchParameters();
  }, []);

  const checkStatus = async () => {
    const submission = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${jobId}`
    );
    if (submission.data.status == "Complete") {
      console.log("Submission already complete");
      setIsFinished(true);
    } else {
      const status = await axios
        .get(
          `https://www.ebi.ac.uk/Tools/services/rest/psiblast/status/${jobId}`
        )
        .then((res) => res.data);

      if (status === "NOT_FOUND") {
        await axios.put(
          `${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${jobId}`,
          {
            status: "Expired",
          }
        );

        Swal.fire({
          icon: "error",
          title: "Submission Has Expired",
          text: "Multiple Sequence Alignment submissions are only stored for 7 days. Redirecting back to submissions page.",
        }).then(() => {
          window.location.href = `/submissions`;
        });
      } else if (status === "FINISHED") {
        // Update Submission status & completion date
        await axios.put(
          `${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${jobId}`,
          {
            status: "Complete",
            completion_date: new Date().toISOString(),
          }
        );

        setIsFinished(true);
      } else {
        // Continue checking after 5 seconds
        setTimeout(checkStatus, 5000);
      }
    }
  };

  const getResults = async () => {
    const submission = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/submissions/${jobId}`
    );
    console.log(submission);
    let username = submission.data.username;
    let date = submission.data.submission_date.split("T")[0];

    const presignedUrl = await axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/api/getJSONFile`, {
        params: {
          s3Key: `users/${username}/${date}/proteinSimilaritySearch/${jobId}/ebi_data.json`,
        },
      })
      .then((res) => res.data.url);
    const fileResponse = await fetch(presignedUrl);
    let inputSequence,
      toolOutput,
      output,
      xmlOutput,
      visualSvgOutput,
      visualPngOutput,
      outputDetail,
      submissionDetail = null;

    if (fileResponse.statusText == "OK") {
      const fileData = await fileResponse.json();
      inputSequence = fileData.inputSequence;
      toolOutput = fileData.toolOutput;
      output = fileData.output;
      xmlOutput = fileData.xmlOutput;
      visualSvgOutput = fileData.visualSvgOutput;
      visualPngOutput = fileData.visualPngOutput;
      outputDetail = fileData.outputDetail;
      submissionDetail = fileData.submissionDetail;
      console.log("AWS download complete");
    } else {
      const fetchResults = (jobId, type) => {
        return axios.get(
          `https://www.ebi.ac.uk/Tools/services/rest/psiblast/result/${jobId}/${type}`
        );
      };

      [
        inputSequence,
        toolOutput,
        output,
        xmlOutput,
        visualSvgOutput,
        visualPngOutput,
        outputDetail,
        submissionDetail,
      ] = await Promise.all([
        fetchResults(jobId, "sequence").then((res) => res.data),
        fetchResults(jobId, "out").then((res) => res.data),
        fetchResults(jobId, "wrapper_out").then((res) => res.data),
        fetchResults(jobId, "xml").then((res) => res.data),
        fetchResults(jobId, "visual-svg").then((res) => res.data),
        fetchResults(jobId, "visual-png").then((res) => res.data),
        fetchResults(jobId, "json").then((res) => res.data),
        fetchResults(jobId, "submission").then((res) => res.data),
      ]);
      const ebi_data = {
        inputSequence: inputSequence,
        toolOutput: toolOutput,
        output: output,
        xmlOutput: xmlOutput,
        visualSvgOutput: visualSvgOutput,
        visualPngOutput: visualPngOutput,
        outputDetail: outputDetail,
        submissionDetail: submissionDetail,
      };

      awsJsonUpload(
        `users/${username}/${date}/proteinSimilaritySearch/${jobId}/ebi_data.json`,
        ebi_data
      );
    }

    const submissionDetailJson = new XMLParser().parseFromString(
      submissionDetail
    );

    setInputSequence(inputSequence);
    setToolOutput(toolOutput);
    setOutput(output);
    setXmlOutput(xmlOutput);
    setVisualSvgOutput(visualSvgOutput);
    setVisualPngOutput(visualPngOutput);
    setOutputDetail(outputDetail);
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
        fileSuffix === "txt"
          ? toolOutput
          : fileSuffix === "xml"
            ? xmlOutput
            : fileSuffix === "svg"
              ? visualSvgOutput
              : "",
    };
    const blob = new Blob([fileInfo.content], {
      type: "text/plain",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${jobId}.${fileInfo.fileSuffix}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    { path: "Protein Similarity Search", link: "/psiblast" },
    { path: "Search Results" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Protein Similarity Search Results`}
        title={`Protein Similarity Search`}
        breadcrumb={breadcrumbPath}
        description={`BLAST stands for Basic Local Alignment Search Tool. The emphasis of
            this tool is to find regions of sequence similarity, which will
            yield functional and evolutionary clues about the structure and
            function of your novel sequence. Position specific iterative BLAST
            (PSI-BLAST) refers to a feature of BLAST 2.0 in which a profile is
            automatically constructed from the first set of BLAST alignments.
            PSI-BLAST is similar to NCBI BLAST2 except that it uses
            position-specific scoring matrices derived during the search, this
            tool is used to detect distant evolutionary relationships. PHI-BLAST
            functionality is available to use patterns to restrict search
            results.`}
      />
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
              <Tab>Visual Output</Tab>
              <Tab>Submission Details</Tab>
            </TabList>
            <TabPanel>
              {toolOutput ? (
                <>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("txt")}
                  >
                    Download in TXT format
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("xml")}
                  >
                    Download in XML format
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
                      <pre>{toolOutput}</pre>
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
              {visualSvgOutput ? (
                <>
                  <Button
                    variant="outlined"
                    sx={{ textTransform: "none", m: 1 }}
                    onClick={() => handleDownload("svg")}
                  >
                    Download in SVG format
                  </Button>
                  <Box
                    sx={{
                      display: "flex",
                      minHeight: "80vh",
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
                      {/* <div
                      dangerouslySetInnerHTML={{ __html: visualSvgOutput }}
                    ></div> */}
                      <div>
                        <img
                          src={`https://www.ebi.ac.uk/Tools/services/rest/psiblast/result/${jobId}/visual-png`}
                          alt="PNG Image"
                        />
                      </div>
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
                          <ListItemText primary={outputDetail.version} />
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
                                Database
                              </Typography>
                            }
                          />
                        </ListItem>
                        <ListItem sx={{ pl: 1, pt: 0, pb: 0 }}>
                          <ListItemText primary={outputDetail.dbs[0].name} />
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
                          .slice(0, -6)
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
                                      index + 1
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

export default PsiBlastResults;
