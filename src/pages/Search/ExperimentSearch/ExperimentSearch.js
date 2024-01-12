import { Container } from "@mui/material";
import MainFeature from "../../../assets/hero.jpeg";
import ExperimentSearchTable from "../../../components/Search/ExperimentSearch/ExperimentSearchTable";

const ExperimentSearch = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Experiment Search</h1>
          <p className="head_text">
            This search interface allows you to use filters to search for
            experiments to find your desired results.
          </p>
        </Container>
      </div>
      <ExperimentSearchTable />
    </>
  );
};

export default ExperimentSearch;
