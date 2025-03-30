import ExperimentSearchTable from "../../../components/Search/ExperimentSearch/ExperimentSearchTable";
import PageHeader from "../../../components/Layout/PageHeader";

const ExperimentSearch = () => {
  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Search" },
    { path: "Experiment Search" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Experiment Search`}
        title={`Experiment Search`}
        breadcrumb={breadcrumbPath}
        description={`This search interface allows you to use filters to search for
            experiments to find your desired results.`}
      />
      <ExperimentSearchTable />
    </>
  );
};

export default ExperimentSearch;
