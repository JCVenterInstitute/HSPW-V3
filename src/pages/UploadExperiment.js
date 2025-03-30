import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

import PageHeader from "../components/Layout/PageHeader";

const sections = ["Experiment Submission", "Data Format and Data Standards"];

const UploadExperiment = () => {
  const headers = ["Software", "Standard File Format Supported"];
  const softwareStandards = [
    { software: "Mascot", standards: "mzTab v1.0, mzIdentML v1.1 v1.2" },
    { software: "MaxQuant", standards: "mzTab v1.0" },
    { software: "OpenMS", standards: "mzTab v1.0, mzIdentML v1.1 v1.2" },
    { software: "PEAKS", standards: "mzIdentML v1.1" },
    { software: "MSGF+", standards: "mzIdentML v1.1" },
    { software: "Byonic (Protein Metrics Inc.)", standards: "mzIdentML v1.1" },
    { software: "Crux", standards: "mzIdentML v1.1" },
    { software: "IDPicker", standards: "mzIdentML v1.1" },
    { software: "IP2", standards: "mzIdentML v1.1" },
    { software: "Iquant", standards: "mzIdentML v1.1" },
    { software: "MyriMatch", standards: "mzIdentML v1.1" },
    { software: "PeptideShaker", standards: "mzIdentML v1.1 v1.2" },
    { software: "PGA", standards: "mzIdentML v1.1" },
    { software: "PIA", standards: "mzIdentML v1.1." },
    { software: "ProteinLynx", standards: "mzIdentML v1.1" },
    { software: "Progenesis QI", standards: "mzIdentML v1.1" },
    { software: "ProteinPilot", standards: "mzIdentML v1.1" },
    { software: "ProteinScape", standards: "mzIdentML v1.1" },
    { software: "ProteoWizard", standards: "mzIdentML v1.1" },
    { software: "Scaffold", standards: "mzIdentML v1.1" },
    { software: "PatternLab", standards: "mzIdentML v1.1" },
    { software: "DTASelect2MzId", standards: "mzIdentML v1.1" },
  ];

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Upload Experiment" },
  ];

  return (
    <>
      <PageHeader
        tabTitle={`HSP | Upload Experiment`}
        title={`Upload Experiment`}
        breadcrumb={breadcrumbPath}
      />
      <Container
        maxWidth="xl"
        sx={{ my: 4 }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 3,
            color: "black",
          }}
        >
          Contents
        </Typography>
        <List component="nav">
          {sections.map((section) => (
            <ListItem
              key={section}
              component="a"
              href={`#${section}`}
              sx={{ color: "#266CB4", padding: 0 }}
            >
              <div style={{ padding: "5px", cursor: "pointer" }}>
                <ListItemText primary={section} />
              </div>
            </ListItem>
          ))}
        </List>
        <Typography
          id="Experiment Submission"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Experiment Submission
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          Human Salivary Proteome (HSP) supports submission of experiments
          coming from all proteomics data workflows. Experiment data format and
          details are listed below and for uploading the data please submit the
          ticket through the <Link to="/contact">Contact us</Link> page.
        </Typography>
        <Typography
          id="Data Format and Data Standards"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Data Format and Data Standards
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          For data to be loaded in the HSP database, data should be a Proteomics
          result file in mztab (version 1.0{" "}
          <Link
            to="http://www.psidev.info/mztab"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.psidev.info/mztab
          </Link>
          ). MzTab is a data standard also developed by members of the
          Proteomics Informatics working group of the PSI to represent both
          identification and quantification data. For PRIDE Archive the mzTab
          file MUST contain the Protein and PSM tables and the Peptide section
          is optional. We recommended this file format to report quantification
          results.
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: "Lato", fontSize: "18px" }}>
          In future, we will support mzIdentML (version 1.1 and 1.2{" "}
          <Link
            to="http://www.psidev.info/mzidentml"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.psidev.info/mzidentml
          </Link>
          ): mzIdentML is a data standard developed by the Proteomics
          Informatics working group of the PSI. The mzIdentML only contains the
          peptide/protein identification information of a proteomics experiment,
          not the quantitation related information.
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Centers the table horizontally
            alignItems: "center", // Centers the table vertically (optional, depending on your design)
            width: "100%", // Ensures the Box takes the full width of its container
          }}
        >
          <Table
            sx={{ marginTop: 3, marginBottom: "20px", maxWidth: "1000px" }}
          >
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      backgroundColor: "#1463B9",
                      color: "white",
                      fontFamily: "Montserrat",
                      fontSize: "18px",
                      fontWeight: "bold",
                      borderRight: "1px solid #3592E4",
                      "&:first-of-type": {
                        borderTopLeftRadius: "16px",
                        borderLeft: "none",
                        borderTop: "none",
                      },
                      "&:last-of-type": {
                        borderTopRightRadius: "16px",
                        borderRight: "none",
                        borderTop: "none",
                      },
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {softwareStandards.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{ fontSize: "15px", border: "1px solid #CACACA" }}
                  >
                    {item.software}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "15px", border: "1px solid #CACACA" }}
                  >
                    {item.standards}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Typography sx={{ mt: 2, fontFamily: "Lato", fontSize: "18px" }}>
          Most of softwares allows mzTab and mzIdentML export, and there are
          many tools (Thermofisher Proteome Discoverer, PGConvertor, OpenMS)
          which allow you to convert mzIdentML to mzTab format.
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: "Lato", fontSize: "18px" }}>
          It is important to highlight that mzIdentML/mzTab files do not contain
          the mass spectra, and HSP does not store the RAW mass spectra data. We
          recommend you to submit the raw data to PRIDE (
          <Link
            to="https://www.ebi.ac.uk/pride/markdownpage/pridesubmissiontool"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.ebi.ac.uk/pride/markdownpage/pridesubmissiontool
          </Link>
          ) or MassIVE (
          <Link
            to="https://massive.ucsd.edu/ProteoSAFe/static/massive.jsp"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://massive.ucsd.edu/ProteoSAFe/static/massive.jsp
          </Link>
          ).
        </Typography>
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          For any further questions or comments, please contact us though{" "}
          <Link to="/contact">Contact us</Link> page.
        </Typography>
      </Container>
    </>
  );
};

export default UploadExperiment;
