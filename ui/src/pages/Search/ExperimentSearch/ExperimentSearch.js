import { Container } from "@mui/material";
import MainFeature from "../../../assets/hero.png";
import ExperimentSearchTable from "../../../components/Search/ExperimentSearch/ExperimentSearchTable";
import { Helmet } from "react-helmet";
import BreadCrumb from "../../../components/Breadcrumbs";

const ExperimentSearch = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Search" },
    { path: "Experiment Search" },
  ];

  return (
    <>
      <Helmet>
        <title>HSP | Experiment Search</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
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
