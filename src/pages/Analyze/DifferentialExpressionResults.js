import { useState } from "react";
import { Container } from "@mui/material";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";

import OptionsBar from "../../components/Analyze/DifferentiaExpAnalysisResults/OptionsBar";
import PageHeader from "../../components/PageHeader";
import ResultSection from "../../components/Analyze/DifferentiaExpAnalysisResults/ResultSection";
import { option } from "../../components/Analyze/DifferentiaExpAnalysisResults/Constants";

const DifferentialExpressionResults = () => {
  const [searchParams] = useSearchParams();
  const { jobId } = useParams();
  const [selectedSection, setSelectedSection] = useState("Volcano Plot");
  const [tab, setTab] = useState("Visualization");
  const [imageUrl, setImageUrl] = useState("");

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Analyze" },
    {
      path: "Differential Expression Analysis",
      link: "/differential-expression",
    },
    { path: "Analysis Results" },
  ];

  const handleTabChange = async (event, newTab) => {
    setTab(newTab);
  };

  const handleSelect = (item) => {
    setSelectedSection(item);
  };

  const handleDataDownload = async () => {
    const link = document.createElement("a");

    if (selectedSection === "Random Forest" && Array.isArray(imageUrl)) {
      if (tab === "right") {
        link.href = imageUrl[2];
      } else if (tab === "left") {
        link.href = imageUrl[0];
      } else if (tab === "middle") {
        link.href = imageUrl[1];
      }
    } else {
      link.href = imageUrl;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (jobId, fileName) => {
    try {
      let index = 0;
      let file = null;

      do {
        if (typeof fileName === Object) {
          file = fileName[index];
        } else {
          file = fileName;
        }

        await axios
          .get(
            `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${file}`
          )
          .then((res) => {
            const link = document.createElement("a");
            link.href = res.data.url;

            console.log("> Link", res.data.url);

            // Set the download attribute to a default filename or based on the URL
            link.download = fileName; // This will take the last part of the URL as a filename

            // Append the link to the body
            document.body.appendChild(link);

            // Trigger a click event on the link
            link.click();

            // Remove the link from the body
            document.body.removeChild(link);
          });
        index++;
      } while (typeof fileName === Object && fileName.length < index);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Differential Expression Results"}
        breadcrumb={breadcrumbPath}
        title={"Differential Expression Analysis Results"}
        description={
          "Visual analytics will identify proteins with differential abundance between experiments in Groups A and B based on their normalized spectral counts."
        }
      />
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
        }}
      >
        <OptionsBar
          selectedSection={selectedSection}
          option={option}
          handleSelect={handleSelect}
        />
        <Container
          maxWidth="xl"
          sx={{ margin: "30px 0 30px 20px" }}
        >
          <ResultSection
            tab={tab}
            selectedSection={selectedSection}
            handleTabChange={handleTabChange}
            handleDataDownload={handleDataDownload}
            numbOfTopVolcanoSamples={searchParams.get("heatmap")}
            setTab={setTab}
            jobId={jobId}
            handleDownload={handleDownload}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
