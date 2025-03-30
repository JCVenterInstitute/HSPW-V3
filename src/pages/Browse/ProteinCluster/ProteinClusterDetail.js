import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Container, TableBody, TableHead } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import PageHeader from "../../../components/Layout/PageHeader";

const Cluster_Detail = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const params = useParams();

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Protein Cluster", link: "/protein-cluster" },
    { path: params.clusterid },
  ];

  const fetchProteinData = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/study-protein-uniprot/${memberId}`
      );

      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch protein data:", error);
      return null; // Return null or some error indicator
    }
  };

  // Fetch all cluster member data
  const fetchClusterMembersData = async (memberIds) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/study-protein/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: Array.from(memberIds),
          }),
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch study details:", error);
      return null; // Return null or some error indicator
    }
  };

  const fetchStudyDetails = async (experimentIds) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/study`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: Array.from(experimentIds),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch study details:", error);
      return null; // Return null or some error indicator
    }
  };

  const fetchCluster = async () => {
    try {
      // Fetch Cluster Data
      const cluster = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT}/api/protein-cluster/${params.clusterid}`
      ).then((res) => res.json());

      setData(cluster); // Set cluster data

      if (cluster && cluster.length > 0 && cluster[0]._source) {
        const { cluster_members } = cluster[0]._source;
        const proteinDetails = []; // Array to hold details for each protein
        const allMemberIds = new Set();
        const studyMap = {};

        // Fetch all cluster member data
        const clusterMembersData = await fetchClusterMembersData(
          cluster_members
        ).then((res) => {
          return res.map((rec) => rec._source);
        });

        // Get the list of unique experiment ids from all of the cluster members
        for (let clusterMember of clusterMembersData) {
          allMemberIds.add(clusterMember.experiment_id_key);
        }

        // Fetch all experiment data
        const studyData = await fetchStudyDetails(allMemberIds);

        for (const study of studyData) {
          studyMap[study._source.experiment_id_key] = study;
        }

        for (let memberId of cluster_members) {
          const proteinData = clusterMembersData.filter(
            (d) => d.Uniprot_id === memberId
          );

          if (proteinData && proteinData.length > 0) {
            for (let protein of proteinData) {
              let detail = {
                uniprot_id: memberId,
                protein_name: "Unknown",
                peptide_count: "N/A",
                abundance_cleavages: "N/A",
                study_details: {},
              };

              if (protein) {
                detail.protein_name = protein.protein_name || "Unknown";

                // Assuming peptide count is part of protein data
                detail.peptide_count = protein.peptide_count || "N/A";

                detail.abundance_cleavages =
                  protein.abundance_cleavages || "N/A";

                if (studyMap[protein.experiment_id_key]) {
                  detail.study_details = studyMap[protein.experiment_id_key]; // Add study details
                }
              }

              proteinDetails.push(detail);
            }
          } else {
            proteinDetails.push({
              uniprot_id: memberId,
              protein_name: "Error Fetching",
              peptide_count: "N/A",
              abundance_cleavages: "N/A",
              study_details: {},
            });
          }
        }

        setProteinDetails(proteinDetails); // Update state with all protein details
      } else {
        // Handle the scenario where the cluster data is not in the expected format.
      }
    } catch (error) {
      console.error("Failed to fetch cluster:", error);
    } finally {
      setLoading(false);
    }
  };

  // Make sure to define the state for proteinDetails
  const [proteinDetails, setProteinDetails] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      fetchCluster();
    }, 3000);
  }, []);

  if (isLoading === true) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress sx={{ mb: "500px", margin: "20px" }} />
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        tabTitle={"HSP | Protein Cluster Detail"}
        title={`Protein Cluster Representative Protein:
            ${data[0]["_source"]["uniprot_id"]}`}
        breadcrumb={breadcrumbPath}
        description={`Number of Members: ${data[0]["_source"]["number_of_members"]}`}
      />
      <Container maxWidth="xl">
        <TableContainer style={{ overflowY: "auto" }}>
          <Table style={{ marginTop: "40px" }}>
            <TableHead>
              <TableRow style={{ border: "1px solid white" }}>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                    borderTopLeftRadius: "10px",
                  }}
                >
                  Accession Number
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                >
                  Peptide Count
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                >
                  Abundance
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                >
                  Tissue
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                  }}
                >
                  Disease State
                </TableCell>
                <TableCell
                  style={{
                    backgroundColor: "#1463B9",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid white",
                    borderTopRightRadius: "10px",
                  }}
                >
                  Institute
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proteinDetails.map((protein, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {protein.protein_name !== "Unknown" &&
                    protein.protein_name !== "Error Fetching" ? (
                      <a href={`/protein/${protein.uniprot_id}`}>
                        {protein.uniprot_id}
                      </a>
                    ) : (
                      protein.uniprot_id
                    )}
                  </TableCell>

                  <TableCell>
                    {protein.protein_name !== "Unknown" &&
                    protein.protein_name !== "Error Fetching"
                      ? protein.protein_name
                      : "N/A"}
                  </TableCell>
                  <TableCell>{protein.peptide_count}</TableCell>
                  <TableCell>{protein.abundance_cleavages}</TableCell>
                  {protein.study_details["_source"] !== undefined ? (
                    <>
                      <TableCell>
                        {protein.study_details["_source"].sample_type || "N/A"}
                      </TableCell>
                      <TableCell>
                        {protein.study_details["_source"].condition_type ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        {protein.study_details["_source"].institution || "N/A"}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>N/A</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};
export default Cluster_Detail;
