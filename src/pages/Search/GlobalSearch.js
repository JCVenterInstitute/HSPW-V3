import { useState } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import Genes from "@Components/Search/GlobalSearch/Genes";
import ProteinClusters from "@Components/Search/GlobalSearch/ProteinClusters";
import ProteinSignatures from "@Components/Search/GlobalSearch/ProteinSignatures";
import Proteins from "@Components/Search/GlobalSearch/Proteins";
import PubMedCitations from "@Components/Search/GlobalSearch/PubMedCitations";
import SalivaryProteins from "@Components/Search/GlobalSearch/SalivaryProteins";
import PageHeader from "@Components/Layout/PageHeader";

const GlobalSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchStarted, setSearchStarted] = useState(false);

  const entityList = [
    "Genes",
    "Protein Clusters",
    "Protein Signatures",
    "Proteins",
    "PubMed Citations",
    "Salivary Proteins",
  ];

  const entities = {
    Genes: Genes,
    "Protein Clusters": ProteinClusters,
    "Protein Signatures": ProteinSignatures,
    Proteins: Proteins,
    "PubMed Citations": PubMedCitations,
    "Salivary Proteins": SalivaryProteins,
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchText !== "") {
      setSubmittedQuery(searchText);
      setSearchStarted(true);
    }

    console.log("Searching for:", searchText);
  };

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Search" },
    { path: "Global Search" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Global Search`}
        title={`Global Search`}
        breadcrumb={breadcrumbPath}
        description={` This search interface allows you to search through all database and
            find the desired results.`}
      />
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", alignItems: "center", mt: 4, mb: 4 }}>
          <form
            onSubmit={handleSearch}
            style={{ width: "100%" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter search keywords"
              value={searchText}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <Button
                    type="submit" // Make the button submit the form
                    startIcon={<SearchIcon />}
                    sx={{ height: "100%", borderRadius: 0 }}
                  >
                    Search
                  </Button>
                ),
              }}
            />
          </form>
        </Box>

        {/* Search Results */}
        {searchStarted && (
          <>
            <Box
              sx={{
                mt: 8,
                display: "flex",
                justifyContent: "center", // Centers the buttons horizontally
                gap: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontFamily: "Montserrat" }}
              >
                Search Results
              </Typography>
            </Box>
            {entityList.map((entity) => {
              const EntityComponent = entities[entity];
              return (
                <EntityComponent
                  key={entity}
                  searchText={submittedQuery}
                />
              );
            })}
          </>
        )}
      </Container>
    </>
  );
};

export default GlobalSearch;
