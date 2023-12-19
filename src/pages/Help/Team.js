import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import main_feature from "../../assets/hero.jpeg";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Stefan from "../../assets/team-members/Stefan-Ruhl.jpg";
import Kathryn from "../../assets/team-members/Kathryn-Kauffman.jpg";
import Marcelo from "../../assets/team-members/Marcelo-Freire.jpg";
import Indresh from "../../assets/team-members/Indresh-Singh.jpeg";
import Harinder from "../../assets/team-members/Harinder-Singh.jpeg";
import Mickey from "../../assets/team-members/Mickey-Zheng.jpg";
import Link from "../../assets/team-members/Link-Wu.jpg";

const Team = () => {
  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
            paddingTop: "25px",
            paddingLeft: "40px",
            paddingBottom: "25px",
          }}
        >
          Team
        </h1>
      </div>
      <Container sx={{ mt: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 3,
            color: "black",
          }}
        >
          Current Team
        </Typography>
        <List component="nav">
          <ListItem
            button
            component="a"
            href="#university-at-buffalo"
            sx={{ color: "#266CB4", padding: 0 }}
          >
            <div style={{ padding: "5px", cursor: "pointer" }}>
              <ListItemText primary="University at Buffalo" />
            </div>
          </ListItem>
          <ListItem
            button
            component="a"
            href="#jcvi"
            sx={{ color: "#266CB4", padding: 0, width: "auto" }}
          >
            <div style={{ padding: "5px", cursor: "pointer" }}>
              <ListItemText primary="J. Craig Venter Institute" />
            </div>
          </ListItem>
          {/* More list items can be added here */}
        </List>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 5,
            mb: 1,
            color: "black",
          }}
          id="university-at-buffalo"
        >
          University at Buffalo
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            alt="1. Stefan Ruhl.jpg"
            src={Stefan}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>Stefan Ruhl, DDS, PhD </b> Stefan is is professor of Oral Biology
            in the School of Dental Medicine at the University at Buffalo, New
            York, USA. He is a past President of the Salivary Research Group
            within the International Association for Dental Research (IADR), in
            2015 was named IADR Salivary Researcher of the Year, and in 2020
            received the IADR Distinguished Scientist Award in Salivary Research
            and was elected as fellow of the American Association for the
            Advancement of Science (AAAS). He has been studying the saliva
            proteome for over 30 years and served as curator of the HSP Wiki
            database since 2013. In his laboratory, he currently studies the
            molecular mechanisms of glycan-mediated microbial adhesion to
            salivary glycoproteins from an evolutionary perspective.{" "}
            <a
              href="https://www.ruhl-lab.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              Lab Website
              <OpenInNewIcon sx={{ fontSize: "medium" }} />
            </a>
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <img
            alt="2. Kathryn Kauffman.jpg"
            src={Kathryn}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>Kathryn Kauffman , PhD </b> Kathryn is an Assistant Professor in
            the Department of Oral Biology in the School of Dental Medicine at
            the University at Buffalo in Buffalo, NY, USA. Her research is
            centered on understanding how viruses shape the ecology and
            evolution of microbial communities and their ecosystems. The current
            focus of her group is on determining how bacterial viruses (phages)
            shape the structure and function of the oral microbiome, and how
            this in turn impacts oral and systemic health.
          </Typography>
        </div>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 5,
            mb: 1,
            color: "black",
          }}
          id="jcvi"
        >
          J. Craig Venter Institute (JCVI)
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            alt="3. Marcelo Freire.jpg"
            src={Marcelo}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>Marcelo Freire, DDS, PhD, DMSc</b> Marcelo is an Associate
            Professor in the Genomic Medicine and Infectious Disease Department
            at the J. Craig Venter Institute (JCVI). His laboratory is focused
            on investigating oral host-microbial interactions impacting health
            and disease.
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <img
            alt="4. Indresh-Singh.jpg"
            src={Indresh}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>Indresh Singh, MSc </b> Indresh is a Sr. Software Engineer,
            leading Informatics Core Services (ICS) at the J. Craig Venter
            Institute (JCVI). His expertise is; high-thoughput computing,
            genomic data analysis, data visualization, software development, and
            scalable infrastructure development and deployment in local and
            cloud environment.
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <img
            alt="4. Harinder-Singh.jpg"
            src={Harinder}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>Harinder Singh, PhD </b> Harinder is a Staff Scientist in the
            Infectious Disease Department at the J. Craig Venter Institute
            (JCVI). Dr. Singh's area of research is mostly focused on various
            data analysis, data mining, development of prediction algorithms and
            databases and bioinformatics pipelines for the scientific community.
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <img
            alt="5. Mickey-Zheng.jpg"
            src={Mickey}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>Mickey Zheng, Bs </b> Mickey is a super hero.
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <img
            alt="6. Link-Wu.jpg"
            src={Link}
            style={{ marginRight: "20px" }}
          />
          <Typography style={{ display: "inline-block" }}>
            <b>I-Lin (Link) Wu, Bs </b> Link is a super hero.
          </Typography>
        </div>
      </Container>
    </>
  );
};

export default Team;
