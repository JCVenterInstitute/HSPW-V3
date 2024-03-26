import { useState } from "react";
import main_feature from "../../assets/hero.jpeg";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Genes from "../../components/Search/GlobalSearch/Genes";
import ProteinClusters from "../../components/Search/GlobalSearch/ProteinClusters";
import ProteinSignatures from "../../components/Search/GlobalSearch/ProteinSignatures";
import Proteins from "../../components/Search/GlobalSearch/Proteins";
import PubMedCitations from "../../components/Search/GlobalSearch/PubMedCitations";
import SalivaryProteins from "../../components/Search/GlobalSearch/SalivaryProteins";
import BreadCrumb from "../../components/Breadcrumbs";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>HSP | Global Search</title>
      </Helmet>
      <BreadCrumb path={breadcrumbPath} />
      <div
        className="head_background"
        style={{ backgroundImage: `url(${main_feature})` }}
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Global Search</h1>
          <p className="head_text">
            This search interface allows you to search through all database and
            find the desired results.
          </p>
        </Container>
      </div>
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
