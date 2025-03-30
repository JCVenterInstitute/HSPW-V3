import React, { useEffect, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useParams } from "react-router";
import FontAwesome from "react-fontawesome";
import { Box, Container, LinearProgress } from "@mui/material";

import PageHeader from "../../../components/Layout/PageHeader";

const th = {
  background: "#f2f2f2",
  textAlign: "center",
  border: "1px solid #aaa",
  fontWeight: "bold",
  fontSize: "20px",
  padding: "0.2em",
};

const td = {
  border: "1px solid #aaa",
  fontSize: "14px",
  padding: "0.2em",
  paddingLeft: "15px",
};

const Citation_detail = (props) => {
  const [abstract, setAbstract] = useState("");
  const [affi, setaffi] = useState("");
  const [keyword, setKeyWord] = useState();
  const [ISSNNum, setISSNNum] = useState();
  const [journalTitle, setjournalTitle] = useState();
  const [authorName, setauthorName] = useState();
  const [year, setYear] = useState();
  const [ta, setTA] = useState();
  const [pgn, setPGN] = useState();
  const [journal, setJournal] = useState();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const params = useParams();

  const url = `${process.env.REACT_APP_API_ENDPOINT}/api/citation/${params["citationid"]}`;

  const breadcrumbPath = [
    { path: "Home", link: "/" },
    { path: "Browse" },
    { path: "Publication", link: "/citation" },
    { path: params["citationid"] },
  ];

  const fetchAbstract = async () => {
    const response = await fetch(
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=" +
        params["citationid"] +
        "&retmode=xml&rettype=abstract&api_key=d5eafed1678a515f8279d979e1da12c76308"
    );

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = await response.text();
    const parser = new DOMParser();
    const xml1 = parser.parseFromString(data, "text/xml");
    if (
      Object.keys(xml1.getElementsByTagName("AbstractText")).length === 0 &&
      Object.keys(xml1.getElementsByTagName("Affiliation")).length === 0
    ) {
      setAbstract("");
      setaffi(" ");
      xml1.getElementsByTagName("MeshHeading");

      let list = xml1.getElementsByTagName("MeshHeading");

      let b = [];
      let c = "";
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].childNodes.length; j++) {
          let string = list[i].childNodes[j].textContent;
          if (j === 0) {
            c = string;
          } else {
            c = c.concat("/" + string);
          }
        }
        b.push(c);
      }
      setKeyWord(b.toString());
      if (xml1.getElementsByTagName("LastName").length >= 1) {
        const lastNameElement = xml1.getElementsByTagName("LastName")[0];
        const initialsElement = xml1.getElementsByTagName("Initials")[0];

        if (lastNameElement && initialsElement) {
          setauthorName(
            `${lastNameElement.textContent || ""} ${
              initialsElement.textContent || ""
            }`
          );
        }
      } else if (xml1.getElementsByTagName("LastName").length === 2) {
        const lastName1 = xml1.getElementsByTagName("LastName")[0];
        const initials1 = xml1.getElementsByTagName("Initials")[0];
        const lastName2 = xml1.getElementsByTagName("LastName")[1];
        const initials2 = xml1.getElementsByTagName("Initials")[1];

        if (lastName1 && initials1 && lastName2 && initials2) {
          setauthorName(
            `${lastName1.textContent || ""} ${
              initials1.textContent || ""
            } and ${lastName2.textContent || ""} ${initials2.textContent || ""}`
          );
        }
      } else if (xml1.getElementsByTagName("LastName").length >= 3) {
        const lastName = xml1.getElementsByTagName("LastName")[0];
        const initials = xml1.getElementsByTagName("Initials")[0];

        if (lastName && initials) {
          setauthorName(
            `${lastName.textContent || ""} ${
              initials.textContent || ""
            }, et al.`
          );
        }
      } else {
        // Handle the case when there is no author information
        setauthorName("Author information not available");
      }
      const volumeElement = xml1.getElementsByTagName("Volume")[0];
      const issueElement = xml1.getElementsByTagName("Issue")[0];

      if (volumeElement && issueElement) {
        setJournal(
          `${volumeElement.textContent || ""}(${
            issueElement.textContent || ""
          })`
        );
      } else {
        // Handle the case when Volume or Issue information is not available
        setJournal("Volume and Issue information not available");
      }
      setYear(xml1.getElementsByTagName("Year")[0].textContent);
      setTA(xml1.getElementsByTagName("MedlineTA")[0].textContent);
      setPGN(xml1.getElementsByTagName("MedlinePgn")[0].textContent);
      setjournalTitle(
        xml1.getElementsByTagName("MedlineJournalInfo")[0].textContent
      );
      setISSNNum(xml1.getElementsByTagName("ISSNLinking")[0].textContent);
    } else {
      setAbstract(xml1.getElementsByTagName("AbstractText")[0].textContent);
      setaffi(xml1.getElementsByTagName("Affiliation")[0].textContent);
      xml1.getElementsByTagName("MeshHeading");

      let list = xml1.getElementsByTagName("MeshHeading");

      let b = [];
      let c = "";
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].childNodes.length; j++) {
          let string = list[i].childNodes[j].textContent;
          if (j === 0) {
            c = string;
          } else {
            c = c.concat("/" + string);
          }
        }
        b.push(c);
      }
      setKeyWord(b.toString());

      if (xml1.getElementsByTagName("LastName").length === 1) {
        setauthorName(
          xml1.getElementsByTagName("LastName")[0].textContent +
            " " +
            xml1.getElementsByTagName("Initials")[0].textContent
        );
      } else if (xml1.getElementsByTagName("LastName").length === 2) {
        setauthorName(
          xml1.getElementsByTagName("LastName")[0].textContent +
            " " +
            xml1.getElementsByTagName("Initials")[0].textContent +
            " and " +
            xml1.getElementsByTagName("LastName")[1].textContent +
            " " +
            xml1.getElementsByTagName("Initials")[1].textContent
        );
      } else if (xml1.getElementsByTagName("LastName").length >= 3) {
        setauthorName(
          xml1.getElementsByTagName("LastName")[0].textContent +
            " " +
            xml1.getElementsByTagName("Initials")[0].textContent +
            ", et al."
        );
      }

      setYear(xml1.getElementsByTagName("Year")[0].textContent);
      setTA(xml1.getElementsByTagName("MedlineTA")[0].textContent);
      if (xml1.getElementsByTagName("MedlinePgn").length === 1) {
        setPGN(xml1.getElementsByTagName("MedlinePgn")[0].textContent);
      }
      setjournalTitle(xml1.getElementsByTagName("MedlineTA")[0].textContent);
      setISSNNum(xml1.getElementsByTagName("ISSNLinking")[0].textContent);
    }
  };

  let interpro_link = "https://pubmed.ncbi.nlm.nih.gov/";

  const fetchSignature = async () => {
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const signature = await response.json();
    setData(signature);

    setLoading(false);
  };

  useEffect(() => {
    fetchAbstract();
    fetchSignature();
  }, []);

  if (isLoading === true) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress sx={{ mb: "500px", margin: "20px" }} />
      </Box>
    );
  }

  const ArrayDisplay = ({ elements }) => {
    return (
      <div>
        {/* Use map to iterate through the array and conditionally add commas */}
        {elements.map((element, index) => (
          <span key={index}>
            {element}
            {index !== elements.length - 1 && ", "}
          </span>
        ))}
      </div>
    );
  };
  return (
    <>
      <PageHeader
        tabTitle={"HSP | Publication Detail"}
        breadcrumb={breadcrumbPath}
        title={`Publication: PubMed: ${params["citationid"]}`}
      />
      <Container maxWidth="xl">
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <TableHead style={{ borderRadius: "1em 0 0 1em" }}>
            <TableRow
              sx={{
                border: "1px solid white",
                borderTopLeftRadius: "10px",
              }}
            >
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid #3592E4",
                  borderTopLeftRadius: "10px",
                }}
                sx={th}
              >
                Title
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                  borderTopRightRadius: "10px",
                }}
              >
                {data[0]["_source"]["Title"]}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                Abstract
              </TableCell>
              {abstract ? (
                <TableCell
                  sx={td}
                  style={{
                    fontFamily: "Lato",
                    fontSize: "14px",
                    border: "1px solid #CACACA",
                  }}
                >
                  {abstract}
                </TableCell>
              ) : (
                <TableCell sx={td}>No Abstract Available</TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                Authors
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                }}
              >
                {data[0]["_source"]["author_names"].map((child, i) => (
                  <span>{data[0]["_source"]["author_names"][i]}</span>
                ))}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                Author Affiliation
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                }}
              >
                {data[0]["_source"]["affiliation"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                Journal
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                }}
              >
                {journalTitle} (ISSN:{ISSNNum})
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                Publication Date
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                }}
              >
                {data[0]["_source"]["PubDate"]}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                MeSH Keywords
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                }}
              >
                <ArrayDisplay elements={data[0]["_source"]["keywords"]} />
              </TableCell>
            </TableRow>
            <TableRow style={{ border: "1px solid white" }}>
              <TableCell
                style={{
                  backgroundColor: "#1463B9",
                  color: "white",
                  fontFamily: "Montserrat",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "1px solid white",
                }}
                sx={th}
              >
                Link
              </TableCell>
              <TableCell
                sx={td}
                style={{
                  fontFamily: "Lato",
                  fontSize: "14px",
                  border: "1px solid #CACACA",
                }}
              >
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={interpro_link + data[0]["_source"]["PubMed_ID"]}
                >
                  {"PubMed "}
                  <FontAwesome
                    className="super-crazy-colors"
                    name="external-link"
                    style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                  />
                </a>
              </TableCell>
            </TableRow>
          </TableHead>
        </div>
      </Container>
    </>
  );
};

export default Citation_detail;
