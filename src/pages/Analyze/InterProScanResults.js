import React, { useEffect, useState } from "react";
import main_feature from "../../components/hero.jpeg";
import { Typography, Container, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const InterProScan = ({ url }) => {
  const { jobId } = useParams();
  const [isFinished, setIsFinished] = useState(false);

  const checkStatus = async () => {
    const status = await axios
      .get(`https://www.ebi.ac.uk/Tools/services/rest/iprscan5/status/${jobId}`)
      .then((res) => res.data);

    if (status === "FINISHED") {
      setIsFinished(true);
    } else {
      // Continue checking after 3 seconds
      setTimeout(checkStatus, 3000);
    }
  };

  // const getResultTypes = async () => {
  //   const resultTypes = await axios.get(
  //     `https://www.ebi.ac.uk/Tools/services/rest/clustalo/resulttypes/${jobId}`
  //   );
  //   console.log(resultTypes);
  //   return resultTypes;
  // };

  useEffect(() => {
    if (!isFinished) {
      checkStatus();
    }
    // getResultTypes();
  }, [jobId, isFinished]);

  const handleRedirect = () => {
    window.open(
      `https://www.ebi.ac.uk/Tools/services/web/toolresult.ebi?jobId=${jobId}&showColors=true&tool=iprscan5`
    );
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
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mt: 3, color: "black" }}
        >
          Sequence Alignment Results:
        </Typography>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mt: 3, color: "black" }}
        >
          Job ID: {jobId}
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
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mt: 3, mb: 2, color: "blue" }}
          >
            Your job is now finished.
          </Typography>
          <Button
            variant="contained"
            endIcon={<ExitToAppIcon />}
            onClick={handleRedirect}
          >
            Redirect
          </Button>
        </Container>
      )}
    </>
  );
};
export default InterProScan;
