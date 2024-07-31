import { useState } from "react";

import TabDescription from "./TabDescription";
import TabOptions from "./TabOptions";
import DataSection from "./DataSection";

const ResultSection = ({ selectedSection, jobId, searchParams }) => {
  const [tab, setTab] = useState("Visualization");
  const numbVolcanoSamples = searchParams.get("heatmap");

  return (
    <>
      <TabOptions
        numbOfTopVolcanoSamples={numbVolcanoSamples}
        selectedSection={selectedSection}
        setTab={setTab}
        jobId={jobId}
        tab={tab}
      />
      <TabDescription
        tab={tab}
        selectedSection={selectedSection}
        numbOfTopVolcanoSamples={numbVolcanoSamples}
      />
      <DataSection
        selectedSection={selectedSection}
        searchParams={searchParams}
        jobId={jobId}
        tab={tab}
        numbOfTopVolcanoSamples={numbVolcanoSamples}
      />
    </>
  );
};

export default ResultSection;
