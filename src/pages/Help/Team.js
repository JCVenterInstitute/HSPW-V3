import React from "react";
import main_feature from "../../components/hero.jpeg";
import { Typography, Container } from "@mui/material";

import Divider from "@mui/material/Divider";
import Stefan from "../head_icon/200px-1._Stefan_Ruhl.jpg";
import Kathryn from "../head_icon/200px-2-_Kathryn_Kauffman,_PhD_.jpg";

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
          }}
        >
          Team
        </h1>
      </div>

      <Container style={{ marginTop: "10px" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 3,
            color: "black",
          }}
        >
          Current Team
        </Typography>
        <Divider
          sx={{
            marginBottom: "10px",
            borderColor: "#1463B9",
            paddingTop: "35px",
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mt: 3,
            color: "black",
          }}
        >
          University at Buffalo
        </Typography>
        <Divider
          sx={{
            marginBottom: "10px",
            borderColor: "#1463B9",
            paddingTop: "35px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            alt="1. Stefan Ruhl.jpg"
            src={Stefan}
            width="200"
            height="198"
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
            salivary glycoproteins from an evolutionary perspective.
          </Typography>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <img
            alt="2. Kathryn Kauffman.jpg"
            src={Kathryn}
            style={{ marginRight: "10px", flexShrink: 0 }}
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
      </Container>
    </>
  );
};

export default Team;
