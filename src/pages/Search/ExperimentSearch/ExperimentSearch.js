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
        <h1
          className="head_title"
          align="left"
        >
          Experiment Search
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            paddingBottom: "15px",
            marginLeft: "20px",
            marginRight: "20px",
          }}
          className="head_text"
        >
          This search interface allows you to use filters to search for
          experiments to find your desired results.
        </p>
      </div>
      <ExperimentSearchTable />
    </>
  );
};

export default ExperimentSearch;
