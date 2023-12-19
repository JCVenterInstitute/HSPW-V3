import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { TableBody, TableHead } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

import main_feature from "../../../assets/hero.jpeg";

const Cluster_Detail = (props) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [proteinName, setProteinName] = useState("");
  const [peptideCount, setPeptideCount] = useState("");
  const [abundance, setAbundance] = useState("");
  const [tissue, setTissue] = useState("");
  const [disease, setDisease] = useState("");
  const [institute, setInstitute] = useState("");
  const params = useParams();
  const [studyDetails, setStudyDetails] = useState({});

  const fetchProteinData = async (memberId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/study_protein_uniprot/${memberId}`
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

  const fetchStudyDetails = async (experiment_id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/study/${experiment_id}`
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
      const clusterResponse = await fetch(
        `http://localhost:8000/api/protein-cluster/${params.clusterid}`
      );
      if (!clusterResponse.ok) {
        throw new Error(`An error has occurred: ${clusterResponse.status}`);
      }
      const cluster = await clusterResponse.json();
      setData(cluster); // Set cluster data

      if (cluster && cluster.length > 0 && cluster[0]._source) {
        let proteinDetails = []; // Array to hold details for each protein

        for (let memberId of cluster[0]._source.cluster_members) {
          const proteinData = await fetchProteinData(memberId);
          if (proteinData && proteinData.length > 0) {
            for (let protein of proteinData) {
              let detail = {
                uniprot_id: memberId,
                protein_name: "Unknown",
                peptide_count: "N/A",
                abundance_cleavages: "N/A",
                study_details: {},
              };
              if (protein["_source"]) {
                detail.protein_name =
                  protein["_source"].protein_name || "Unknown";
                // Assuming peptide count is part of protein data
                detail.peptide_count =
                  protein["_source"].peptide_count || "N/A";
                detail.abundance_cleavages =
                  protein["_source"].abundance_cleavages || "N/A";
                const studyData = await fetchStudyDetails(
                  protein["_source"].experiment_id_key
                );
                if (studyData) {
                  detail.study_details = studyData; // Add study details
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
        console.log(proteinDetails);
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
      <div
        style={{
          backgroundImage: `url(${main_feature})`,
        }}
        className="head_background"
      >
        <h1
          className="head_title"
          align="left"
        >
          Protein Cluster Representative Protein:
          {data[0]["_source"]["uniprot_id"]}
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
          Number of Members: {data[0]["_source"]["number_of_members"]}
        </p>
      </div>
      <TableContainer style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table style={{ margin: "40px", maxWidth: "90%" }}>
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
                    <a
                      href={`http://localhost:3000/protein/${protein.uniprot_id}`}
                    >
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
                {protein.study_details[0] !== undefined ? (
                  <>
                    <TableCell>
                      {protein.study_details[0]["_source"].sample_type || "N/A"}
                    </TableCell>
                    <TableCell>
                      {protein.study_details[0]["_source"].condition_type ||
                        "N/A"}
                    </TableCell>
                    <TableCell>
                      {protein.study_details[0]["_source"].institution || "N/A"}
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
    </>
  );
};
export default Cluster_Detail;
