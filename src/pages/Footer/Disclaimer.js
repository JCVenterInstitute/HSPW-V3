import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import FontAwesome from "react-fontawesome";

import MainFeature from "../../assets/hero.jpeg";

const sections = [
  "Notice",
  "Liability",
  "Endorsement",
  "Copyright Status",
  "Acknowledgements",
];

const DisclaimerPage = () => {
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
          General Disclaimer
        </h1>
      </div>
      <Container sx={{ my: 4 }}>
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
        <List>
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
          id="Notice"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Notice
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography
          variant="div"
          sx={{ fontFamily: "Lato" }}
        >
          To assure the integrity of information on this server, we reserve the
          right to monitor system access if malicious actions are taken to
          disable our on-line services or intentionally gain unauthorized access
          to systems. <br />
          By posting on this site, you are agreeing to abide by the following
          guidelines:
          <List sx={{ listStyleType: "disc", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              Please limit comments to the subject matter on which you are
              commenting.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Please don’t post anything inappropriate that may upset, harass,
              or embarrass another person, or break any U.S. law.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Please don’t post any medical advice, or accept any medical advice
              from other users.
            </ListItem>
          </List>
          Although we will do our utmost to avoid this, we reserve the right to
          edit, delete, move or otherwise alter content posted by users.
        </Typography>
        <Typography
          id="Liability"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Liability
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          Concerning documents and software available from this server, the JCVI
          does not warrant or assume any legal liability or responsibility for
          the accuracy, completeness, or usefulness of any information,
          apparatus, product, or process disclosed.
        </Typography>
        <Typography
          id="Endorsement"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Endorsement
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          <strong>General</strong> - The Human Salivary Proteome Wiki (HSPW)
          endorses or recommends any commercial products, processes, or
          services. The views and opinions of authors expressed on the site do
          not necessarily state or reflect those of the U.S. Government, and
          they may not be used for advertising or product endorsement purposes.{" "}
          <br />
          <br />
          <strong>External Links</strong> - Some pages in the wiki may provide
          links to other Internet sites for the convenience of our users. HSPW
          is not responsible for the availability or content of these external
          sites, nor does HSPW endorse, warrant or guarantee the products,
          services or information described or offered at these other Internet
          sites. Users cannot assume that the external sites will abide by the
          same Privacy Policy to which this site adheres. It is the
          responsibility of the user to examine the copyright and licensing
          restrictions of linked pages and to secure all necessary permissions.{" "}
          <br />
          <br />
          <strong>Pop-Up Advertisements</strong> - When visiting our Web site,
          your Web browser may produce pop-up advertisements. These
          advertisements were most likely produced by other Web sites you
          visited or by third party software installed on your computer. HSPW
          does not endorse or recommend products or services contained in any
          pop-up advertisements that may appear on your computer screen while
          visiting our site.
        </Typography>
        <Typography
          id="Copyright Status"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Copyright Status
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato" }}>
          The HSPW does not claim copyright on the data and software used on
          this site. However, some documents available from this server may be
          protected under U.S. and foreign copyright laws. Users shall adhere to
          our copyright policy when accessing this site.
        </Typography>
        <Typography
          id="Acknowledgements"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Acknowledgement
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <div style={{ fontFamily: "Lato" }}>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            This wiki uses a number of third-party resources, which are herein
            acknowledged:
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            EBI Web Services
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            Services on this site provided by the European Bioinformatics
            Institute include BLAST, ClustalW, InterProScan, and PICR.
            <br />
            <br />
            <strong>Labarga A, et al.</strong> (2007) Web services at the
            European bioinformatics institute. Nucleic Acids Res. 35(Web Server
            issue):W6-11
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/17576686"
            >
              {" [PubMed:17576686] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            Human Protein Atlas
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            The Tissue Atlas from the Human Protein Atlas shows the expression
            and localization of human proteins across tissues and organs, based
            on deep sequencing of RNA (RNA-seq) from 37 major different normal
            tissue types and immunohistochemistry on tissue microarrays
            containing 44 different tissue types. The Human Protein Atlas is
            licensed under the Creative Commons Attribution-ShareAlike 4.0
            International License for all copyrightable parts. <br />
            <br />
            <strong>Uhlén M, et al.</strong>
            (2015) Proteomics. Tissue-based map of the human proteome. Science
            347(6220):1260419. doi:10.1126/science.1260419
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/25613900"
            >
              {" [PubMed:25613900] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            InterPro
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            Integrated Resource Of Protein Domains And Functional Sites.
            Copyright (C) 2001 The InterPro Consortium.
            <br />
            <br />
            <strong>Hunter S, et al.</strong>
            (2009) InterPro: the integrative protein signature database. Nucleic
            Acids Res. 37(Database issue):D211-5
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/18940856"
            >
              {" [PubMed:18940856] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            KEGG
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            The Kyoto Encyclopedia of Genes and Genomes is used for
            non-commercial purpose. Coypright (C) Kanehisa Laboratories.
            <br />
            <br />
            <strong>Kanehisa M, et al.</strong>
            (2008) KEGG for linking genomes to life and the environment. Nucleic
            Acids Res. 36(Database issue):D480-4
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/18077471"
            >
              {" [PubMed:18077471] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
            <br />
            <br />
            <strong>Kanehisa M, et al.</strong>
            (2006) From genomics to chemical genomics: new developments in KEGG.
            Nucleic Acids Res. 34(Database issue):D354-7
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/16381885"
            >
              {" [PubMed:16381885] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
            <br />
            <br />
            <strong>Kanehisa M and Goto S</strong>
            (2000) KEGG: kyoto encyclopedia of genes and genomes. Nucleic Acids
            Res. 28(1):27-30
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/10592173"
            >
              {" [PubMed:10592173] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            NCBO Web Services
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            The Annotator developed by the National Center for Biomedical
            Ontology is a Web service that annotates text with relevant ontology
            concepts.
            <strong>Jonquet C, et al.</strong>
            (2009) The open biomedical annotator. Summit on Translat Bioinforma
            2009:56-60
            <a
              rel="noreferrer"
              target="_blank"
              href="https://pubmed.ncbi.nlm.nih.gov/21347171"
            >
              {" [PubMed:21347171] "}
              <FontAwesome
                className="super-crazy-colors"
                name="external-link"
                style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
              />
            </a>
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            PubMed
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            Data are provided by the National Library of Medicine (NLM). NLM
            does not claim the copyright on the abstracts in PubMed; however,
            journal publishers or authors may. NLM provides no legal advice
            concerning distribution of copyrighted materials, consult your legal
            counsel.
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato" }}
          >
            UniProt
          </Typography>
          <Typography sx={{ marginBottom: "30px", fontFamily: "Lato" }}>
            All databases and documents in the UniProt FTP directory and web
            sites are distributed under the Creative Commons
            Attribution-NoDerivs License.
          </Typography>
          <strong>Boeckmann B, et al.</strong>
          (2003) The SWISS-PROT protein knowledgebase and its supplement TrEMBL
          in 2003. Nucleic Acids Res. 31(1):365-70
          <a
            rel="noreferrer"
            target="_blank"
            href="https://pubmed.ncbi.nlm.nih.gov/12520024"
          >
            {" [PubMed:12520024] "}
            <FontAwesome
              className="super-crazy-colors"
              name="external-link"
              style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
            />
          </a>
        </div>
      </Container>
    </>
  );
};

export default DisclaimerPage;
