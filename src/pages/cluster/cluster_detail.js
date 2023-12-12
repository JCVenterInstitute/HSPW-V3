import main_feature from "../../components/hero.jpeg";
import React from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { TableBody, TableHead } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import FontAwesome from "react-fontawesome";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
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

  const fetchCluster = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/protein_cluster/${params.clusterid}`
      );
      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }
      const cluster = await response.json();
      setData(cluster);
      console.log(cluster);
      if (cluster && cluster.length > 0 && cluster[0]._source) {
        // Now the data is available, so you can log and process it

        for (let i = 0; i < cluster[0]["_source"].cluster_members.length; i++) {
          try {
            const proteinResponse = await fetchProtein(
              cluster[0]._source.cluster_members[i]
            );
            const protein = await proteinResponse.json();
            console.log(protein);
            // Perform further operations with 'protein' here
          } catch (error) {
            console.error("Failed to fetch protein:", error);
            // Handle errors for individual protein fetches here
          }
        }
      } else {
        // Handle the scenario where the data is not in the expected format
      }
    } catch (error) {
      console.error("Failed to fetch cluster:", error);
      // Handle the error scenario
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCluster();
    }, 3000);
  }, []);

  const fetchProtein = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/study_protein_uniprot/${id}`
      );
      if (!response.ok) {
        throw new Error(`An error has occurred: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch protein:", error);
      // Handle the error scenario, possibly return a placeholder or error indicator
    }
  };

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
        <h1 className="head_title" align="left">
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
          {data[0]["_source"]["cluster_members"].map((value, i) => {
            return (
              <TableRow key={i}>
                <TableCell
                  style={{
                    borderRight: "1px solid grey",
                    borderBottom: "1px solid grey",
                    width: "15%",
                  }}
                >
                  {value}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};
export default Cluster_Detail;
