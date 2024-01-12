import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import FontAwesome from "react-fontawesome";

import MainFeature from "../../assets/hero.jpeg";

const sections = ["Citation Guidelines", "Contacting Us"];

const CopyrightPage = () => {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${MainFeature})`,
        }}
        className="head_background"
      >
        <Container maxWidth="xl">
          <h1 className="head_title">Copyright</h1>
        </Container>
      </div>
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
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Copyright
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          Information available on this site is within the public domain and may
          be freely distributed and copied. However, it is requested that in any
          subsequent use of this work, appropriate acknowledgment will be given.
        </Typography>
        <br />
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          Submitters agree that their posted material is released into the
          public domain unless clearly stated otherwise. Contributors shall
          ensure that they have the permission to publish or distribute the
          material under this condition. Some contributors of the original data
          (or the country of origin of such data) may claim patent, copyright,
          or other intellectual property rights in all or a portion of the data
          (that has been submitted). HSPW is not in a position to assess the
          validity of such claims and therefore cannot provide comment or
          unrestricted permission concerning the use, copying, or distribution
          of such content.
        </Typography>
        <br />
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          This site also incorporates external resources, such as Gene Ontology,
          KEGG, Medline, and UniProt, which may contain material protected by
          U.S. and foreign copyright laws. All persons reproducing,
          redistributing, or making commercial use of this information are
          expected to adhere to the terms and conditions asserted by the
          copyright holder. Transmission or reproduction of protected items
          beyond that allowed by fair use as defined in the copyright laws
          requires the written permission of the copyright owners.
        </Typography>
        <Typography
          id="Citation Guidelines"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Citation Guidelines
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <div style={{ fontFamily: "Lato", fontSize: "18px" }}>
          If you cite or display any content, or reference our organization, in
          any format, written or otherwise, including print or web publications,
          presentations, grant applications, websites, other online applications
          such as blogs, or other works, please follow these guidelines:
          <List sx={{ listStyle: "decimal", pl: 4 }}>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText>
                Include a reference to a primary publication: <br />
                <a href="/">
                  The Human Salivary Proteome: A Community-Driven Research
                  Platform{" "}
                  <FontAwesome
                    className="super-crazy-colors"
                    name="external-link"
                    style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                  />
                </a>
                <br /> <br /> And
              </ListItemText>
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              <ListItemText>
                Include a reference to our website: <br />
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://journals.sagepub.com/doi/abs/10.1177/00220345211014432"
                >
                  SalivaryProteome.org{" "}
                  <FontAwesome
                    className="super-crazy-colors"
                    name="external-link"
                    style={{ textShadow: "0 1px 0 rgba(0, 0, 0, 0.1)" }}
                  />
                </a>
              </ListItemText>
            </ListItem>
          </List>
        </div>
        <Typography
          id="Contacting Us"
          variant="h5"
          sx={{
            fontFamily: "Montserrat",
            fontWeight: "bold",
            mt: 4,
            mb: 3,
            color: "black",
          }}
        >
          Contacting Us
        </Typography>
        <div
          style={{
            height: "3px",
            background: "linear-gradient(to right, #1463B9, #ffffff)",
            marginBottom: "30px",
          }}
        ></div>
        <Typography sx={{ fontFamily: "Lato", fontSize: "18px" }}>
          If your manuscript or abstract submission is accepted, our team would
          greatly appreciate notifications of the publication citation, solely
          for tracking resource usage.
        </Typography>
      </Container>
    </>
  );
};

export default CopyrightPage;
